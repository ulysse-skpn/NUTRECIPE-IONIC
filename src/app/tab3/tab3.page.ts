import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BookmarksService } from '../services/bookmarks/bookmarks.service';
import { IIngredientBookmarkIn , IRecipeBookmarkIn } from 'src/app/interfaces/IBookmark';
import { IngredientsService } from '../services/ingredients/ingredients.service';
import { RecipesService } from '../services/recipes/recipes.service';
import { ModalComponent } from '../components/modal/modal/modal.component';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['./../../global.scss']
})
export class Tab3Page implements OnInit {

  connected:boolean = false
  selectTab:string = "all"
  searchTerm:string = ""
  recipeList = []
  ingredientList = []

  constructor(
    private bookmarkService:BookmarksService,
    private ingredientService:IngredientsService,
    private recipeService:RecipesService,
    private toastController:ToastController,
    private modalController:ModalController,
    private jwtHelper: JwtHelperService,
    private router:Router
  ) {}

  ngOnInit(): void 
  {
    const token = sessionStorage.getItem("access_token")

    if( this.jwtHelper.isTokenExpired(token) ) this.router.navigate(["/notauthorized"])
    this.connected = true

    if( sessionStorage.getItem("tab3_segment") ) this.selectTab = sessionStorage.getItem("tab3_segment")
    else this.selectTab = 'all'
    
    this.loadIngredientBookmarks()
    this.loadRecipeBookmarks()
  }

  loadIngredientBookmarks()
  {
    this.bookmarkService.getAllIngredientBookmarks().subscribe( async(res) => {
      res.forEach( (element:any) => {
        element['expanded'] = false

        element.ingredient.isBookmarked = element.saved

        this.ingredientList.push(element.ingredient)
      })
      
    })
  }

  loadRecipeBookmarks()
  {
    this.bookmarkService.getAllRecipeBookmarks().subscribe( async(res) => {
      
      res.forEach( (element:any) => {
        element['expanded'] = false

        element.recipe.isBookmarked = element.saved
        
        this.recipeList.push(element.recipe)
      })

    })
  }

  async detailRecipe( event:Event , id:number )
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

  async detailIngredient( event:Event , id:number )
  {
    event.stopPropagation()

    this.ingredientService.getIngredientById(id).subscribe( async(res) => {
      
      const modal = await this.modalController.create({
        component:ModalComponent,
        swipeToClose:true,
        componentProps: { 
          type:'ingredient-details' , 
          product_name: res.product_name,
          ingredient_text: res.ingredient_text,
          carbohydrates: res.carbohydrates,
          proteins: res.proteins,
          fats: res.fats,
          salt: res.salt,
          calories: res.calories,
          nova_group: res.nova_group,
          categories_ingredient: res.categories,
          serving_size_ingredient:res.serving_size,
          image_ingredient:res.image,
        },
        animated: true,
        backdropDismiss:true
      })
  
      return modal.present()
    })
  }

  async bookmark( event:Event , type:string, item:any )
  {
    event.stopPropagation()

    if( sessionStorage.getItem("userId") === null ) return

    const id = parseInt( sessionStorage.getItem("userId") )

    const toast = await this.toastController.create({
      message: "Retrait des favoris",
      duration:3000,
      buttons:
      [
        {
          text: 'Annuler',
          role:'cancel',
          handler: () => { 
            console.log('Annulation')
          }
        }
      ]
    })

    await toast.present()
    
    await toast.onDidDismiss().then( (e) => {

      if( e.role === "cancel" ) return

      item.isBookmarked = !item.isBookmarked  

      if( type === "ingredient" )
      {
        const bookmark: IIngredientBookmarkIn = 
        {
          ingredientId: item.ingredientId,
          userId: id,
          saved: false
        } 
  
        this.bookmarkService.updateIngredientBookmark(bookmark , bookmark.ingredientId).subscribe()
      }
      else if( type === "recipe" )
      {
        const bookmark: IRecipeBookmarkIn = 
        {
          recipeId: item.recipeId,
          userId: id,
          saved: false
        } 
  
        this.bookmarkService.updateRecipeBookmark(bookmark , bookmark.recipeId).subscribe()
      }

    })
  }

  expand(item:any)
  {
    item.expanded = !item.expanded
  }

  saveTab(tab:string)
  {
    sessionStorage.setItem( "tab3_segment" , tab )
  }
}
