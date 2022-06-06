import { Component, OnInit } from '@angular/core';
import { ToastController , ModalController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal/modal.component';
import { IRecipeBookmarkIn } from '../interfaces/IBookmark';
import { IRecipeOut } from '../interfaces/IRecipe';
import { BookmarksService } from '../services/bookmarks/bookmarks.service';
import { RecipesService } from '../services/recipes/recipes.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['./../../global.scss']
})
export class Tab1Page implements OnInit {

  connected:boolean = false
  searchTerm:string = ""
  recipeArraySize!:number
  recipeList = []
  randomRecipe:IRecipeOut
  randomRecipeIngredientsList:string[]
  randomRecipeInstructions:string[]
  selectTab!:string
  pageIndex:number = 0
  pageSize:number = 30

  constructor(
    private recipeService:RecipesService,
    private bookmarkService:BookmarksService,
    private toastController:ToastController,
    private modalController:ModalController
  ) {}

  ngOnInit(): void 
  {
    if( sessionStorage.getItem("access_token") !== null ) this.connected = true

    if( sessionStorage.getItem("tab1_segment") !== null ) this.selectTab = sessionStorage.getItem("tab1_segment")
    else this.selectTab = 'card'
    
    this.recipeService.getSizeArrayRecipes().subscribe( async(res) => {
      this.recipeArraySize = res.nbElem
      
      if( this.selectTab === "random" ) this.getRandomRecipe()
    })

    this.loadRecipes()
  }

  loadRecipes( pIndex:number = this.pageIndex , pSize:number = this.pageSize )
  {
    this.recipeService.getAllRecipesPagination( pIndex, pSize ).subscribe( async(res) => {
      res.forEach( (element:any) => {
        element['expanded'] = false
        element['isBookmarked'] = null

        if( element.bookmarkRecipe ) element['isBookmarked'] = element.bookmarkRecipe.saved

        this.recipeList.push(element)
      });
    })
  }

  async detail( event:Event , id:number )
  {
    event.stopPropagation()

    this.recipeService.getRecipeById(id).subscribe( async(res) => {
      
      const modal = await this.modalController.create({
        component:ModalComponent,
        swipeToClose:true,
        componentProps: { 
          type:'recipe-details' , 
          title:res.title,
          prep:res.prep_time,
          cook:res.cooking_time,
          rest:res.rest_time,
          categories:res.categories,
          ingredients_list:res.ingredients_list,
          instructions:res.instructions,
          serving_size:res.serving_size,
          image:res.image,
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

    
    if( sessionStorage.getItem("userId") === null ) return

    const userId = parseInt( sessionStorage.getItem("userId") )

    const bookmark:IRecipeBookmarkIn = 
    {
      recipeId: item.recipeId,
      userId:userId,
      saved: isSaved
    }
    
    this.bookmarkService.updateRecipeBookmark( bookmark , item.recipeId ).subscribe()
    this.showToast( message );
  }

  async showToast( message:string ){
    await this.toastController.create({
      message: message,
      duration:2000
    }).then(res => res.present());
  }

  getRandomRecipe()
  {
    const randomId = this.randomInt()

    this.recipeService.getRecipeById(randomId).subscribe( (res:IRecipeOut) => {
      res['expanded'] = false
      res.ingredients_list = this.removeSpecialChars(res.ingredients_list)
      this.randomRecipeIngredientsList = this.createStep(res.ingredients_list,",")

      res.instructions = this.removeSpecialChars(res.instructions)
      this.randomRecipeInstructions = this.createStep(res.instructions,".")
    
      this.randomRecipe = res
      return this.randomRecipe 
    })
  }

  randomInt()
  {
    return Math.floor( Math.random() * ( this.recipeArraySize + 1 ) )
  }

  removeSpecialChars(string:string)
  {
    return string.replace(/[\[\]"']+/g,'').split(",").toString()
  }

  createStep(string:string,separator:string)
  { 
    let result:any
    const steps = string.split(separator)

    result = steps.map( item => {
      if( item.slice(0).startsWith(",") ) 
        return item.slice(1)
      else 
        return item.charAt(0).toUpperCase() + item.slice(1)
    })
    
    return result.slice(0,-1)
  }

  loadData(event:any)
  {
      this.pageIndex = this.pageIndex + 1
      
      this.loadRecipes( this.pageIndex , this.pageSize )

      event.target.complete()

      if( this.recipeList.length === this.recipeArraySize ) event.target.disabled = true
  }

  expand( event:Event , recipe)
  {
    event.stopPropagation()
    recipe.expanded = !recipe.expanded
  }

  saveTab(tab:string)
  {
    sessionStorage.setItem( "tab1_segment" , tab )
  }
}
