import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() type: string

  // Recipe
  @Input() title:string
  @Input() prep:string
  @Input() cook:string
  @Input() rest:string
  @Input() categories:string
  @Input() ingredients_list:any
  @Input() instructions:any
  @Input() serving_size:string
  @Input() image:string

  // Ingredient
  @Input() product_name:string
  @Input() ingredient_text:any
  @Input() carbohydrates:number
  @Input() proteins:number
  @Input() fats:number
  @Input() salt:number
  @Input() calories:number
  @Input() nova_group:string
  @Input() categories_ingredient:string
  @Input() serving_size_ingredient:string
  @Input() image_ingredient:string
  
  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit(): void
  {
    if( this.type === "recipe-details" )
    {
      this.ingredients_list = this.removeSpecialChars(this.ingredients_list)
      this.instructions = this.removeSpecialChars(this.instructions)
    }
    else if( this.type === "ingredient-details" )
    {
      this.ingredient_text = this.removeSpecialChars(this.ingredient_text)
    }
  }

  removeSpecialChars(string:string)
  {
    if( string ) return string.replace(/[\[\]"']+/g,'').split(",")
  }

  close()
  {
    this.modalController.dismiss()
  }

}
