import { IIngredientOut } from "./IIngredient"
import { IRecipeOut } from "./IRecipe"

export interface IIngredientBookmarkIn
{
    ingredientId:number
    userId:number
    saved:boolean
}

export interface IIngredientBookmarkOut
{
    ingredient:IIngredientOut
    ingredientId:number
    userId:number
    saved:boolean
}

export interface IRecipeBookmarkIn
{
    recipeId:number
    userId:number
    saved:boolean
}

export interface IRecipeBookmarkOut
{
    recipe:IRecipeOut
    recipeId:number
    userId:number
    saved:boolean
}