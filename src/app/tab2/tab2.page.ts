import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal/modal.component';
import { IIngredientBookmarkIn } from '../interfaces/IBookmark';
import { BookmarksService } from '../services/bookmarks/bookmarks.service';
import { IngredientsService } from '../services/ingredients/ingredients.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['./../../global.scss']
})
export class Tab2Page implements OnInit {

  connected:boolean = false
  searchTerm:string = ""
  ingredientArraySize!:number
  ingredientList = []
  selectTab!:string
  pageIndex:number = 0
  pageSize:number = 10

  constructor(
    private ingredientService:IngredientsService,
    private bookmarkService:BookmarksService,
    private toastController:ToastController,
    private modalController:ModalController
  ) {}

  ngOnInit(): void 
  {
    if( sessionStorage.getItem("access_token") !== null ) this.connected = true

    if( sessionStorage.getItem("tab2_segment") != null ) this.selectTab = sessionStorage.getItem("tab2_segment")
    else this.selectTab = 'card'
    
    this.ingredientService.getSizeArrayIngredients().subscribe( async(res) => {
      this.ingredientArraySize = res.nbElem
    })

    this.loadIngredients()
  }

  loadIngredients( pIndex:number = this.pageIndex , pSize:number = this.pageSize )
  {
    this.ingredientService.getAllIngredients( pIndex, pSize ).subscribe( async(res) => {
      
      res.forEach( (element:any) => {
        element['expanded'] = false
        element['isBookmarked'] = null

        if( element.bookmarkIngredient ) element['isBookmarked'] = element.bookmarkIngredient.saved

        this.ingredientList.push(element)
      });
    })
  }

  async detail( event:Event , id:number )
  {
    event.stopPropagation()

    this.ingredientService.getIngredientById(id).subscribe( async(res) => {
      
      const modal = await this.modalController.create({
        component:ModalComponent,
        swipeToClose:true,
        componentProps: { 
          type:'ingredient-details' , 
          product_name:res.product_name,
          ingredient_text:res.ingredient_text,
          carbohydrates:res.carbohydrates,
          proteins:res.proteins,
          fats:res.fats,
          salt:res.salt,
          calories:res.calories,
          nova_group:res.nova_group,
          categories_ingredient:res.categories,
          serving_size_ingredient:res.serving_size,
          image_ingredient:res.image,
        },
        animated: true,
        backdropDismiss:true
      })
  
      return modal.present()
    })
    
  }


  bookmark( event:Event , item:any )
  {
    event.stopPropagation()
    
    item.isBookmarked = !item.isBookmarked
    
    let message!:string
    let isSaved!:boolean

    if( item.isBookmarked === true )
    {
      message = "Ajouté aux favoris"
      isSaved = true
    }
    else 
    {
      message = "Retrait des favoris"
      isSaved = false
    }


    if( !sessionStorage.getItem("userId") ) return

    const userId = parseInt( sessionStorage.getItem("userId") )

    const bookmark:IIngredientBookmarkIn =
    {
      ingredientId: item.ingredientId,
      userId:userId,
      saved: isSaved
    }

    this.bookmarkService.updateIngredientBookmark( bookmark , item.ingredientId ).subscribe()
    this.showToast( message );
  }

  async showToast( message:string ){
    await this.toastController.create({
      message: message,
      duration:2000
    }).then(res => res.present());
  }

  loadData(event:any)
  {
      this.pageIndex = this.pageIndex + 1
      
      this.loadIngredients( this.pageIndex , this.pageSize )

      event.target.complete()

      if( this.ingredientList.length === this.ingredientArraySize ) event.target.disabled = true
  }

  expand( event:Event , ingredient)
  {
    event.stopPropagation()
    ingredient.expanded = !ingredient.expanded
  }

  saveTab(tab:string)
  {
    sessionStorage.setItem( "tab2_segment" , tab )
  }
}
