import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ComponentFixture, TestBed, waitForAsync , fakeAsync , tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { IngredientsService } from '../services/ingredients/ingredients.service';
import { Tab2Page } from './tab2.page';
import { Tab1Page } from '../tab1/tab1.page';
import { Tab3Page } from '../tab3/tab3.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu/side-menu/side-menu.component';
import { of } from 'rxjs';
import { IIngredientOut } from '../interfaces/IIngredient';


const mockIngredientList:IIngredientOut[] = 
[
  {
    id: 0,
    product_name: '',
    ingredient_text: '',
    carbohydrates: 0,
    proteins: 0,
    fats: 0,
    salt: 0,
    calories: 0,
    nova_group: 1,
    categories: '',
    serving_size: '',
    image: '',
    createdAt: undefined,
    updatedAt: undefined
  }
]

const mockIngredient:IIngredientOut = 
{
  id: 0,
  product_name: '',
  ingredient_text: '',
  carbohydrates: 0,
  proteins: 0,
  fats: 0,
  salt: 0,
  calories: 0,
  nova_group: 1,
  categories: '',
  serving_size: '',
  image: '',
  createdAt: undefined,
  updatedAt: undefined
}

const event:Event =
{
  bubbles: false,
  cancelBubble: false,
  cancelable: false,
  composed: false,
  currentTarget: undefined,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: false,
  returnValue: false,
  srcElement: undefined,
  target: null,
  timeStamp: 0,
  type: '',
  composedPath: function (): EventTarget[] {
    throw new Error('Function not implemented.');
  },
  initEvent: function (type: string, bubbles?: boolean, cancelable?: boolean): void {
    throw new Error('Function not implemented.');
  },
  preventDefault: function (): void {
    throw new Error('Function not implemented.');
  },
  stopImmediatePropagation: function (): void {
    throw new Error('Function not implemented.');
  },
  stopPropagation: function (): void {
    console.log("stop propagation")
  },
  AT_TARGET: 0,
  BUBBLING_PHASE: 0,
  CAPTURING_PHASE: 0,
  NONE: 0
}


describe('Tab2Page', () => {
  let component: Tab2Page
  let fixture: ComponentFixture<Tab2Page>
  let ingredientService:IngredientsService
  let store = {}

  beforeEach(waitForAsync(() => {

    spyOn(sessionStorage, 'setItem').and.callFake((key, value) => {
      store[key] = value
      return store
    })
  
    spyOn(sessionStorage,'getItem').and.callFake( (key) => {
      return store[key] || null
    })

    TestBed.configureTestingModule({
      declarations: [Tab2Page , SideMenuComponent],
      imports: [IonicModule.forRoot() , HttpClientTestingModule , Ng2SearchPipeModule , FormsModule , RouterTestingModule.withRoutes([
        {
          path:'tabs/tab1' , component:Tab1Page
        },
        {
          path:'tabs/tab2' , component:Tab2Page
        },
        {
          path:'tabs/tab3' , component:Tab3Page
        }
      ]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page)
    component = fixture.componentInstance
    fixture.detectChanges()

    ingredientService = TestBed.inject(IngredientsService)
  }));

  it('should create Tab2 Page', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit method and the selectTab is "list"', fakeAsync( () => {
    spyOn<Tab2Page , any>(component,'ngOnInit').and.callThrough()

    sessionStorage.setItem("access_token","lorem")
    sessionStorage.setItem("tab2_segment","list")

    const token = sessionStorage.getItem("token")
    let tab = sessionStorage.getItem("tab2_segment")
    
    expect(sessionStorage.setItem).toHaveBeenCalled()
    expect(sessionStorage.getItem).toHaveBeenCalled()

    if( token !== null )
    {
      expect(component.connected).toBeTrue()
    }

    if( tab !== null )
    {
      expect(tab).toEqual("list")
    }

    const ingredientServiceSpy = spyOn(ingredientService,'getSizeArrayIngredients').and.returnValue(of(10))

    component.ngOnInit()
    tick()
    expect(ingredientServiceSpy).toHaveBeenCalled()
  }))

  it('should call ngOnInit method and the selectTab is "card"', fakeAsync( () => {
    spyOn<Tab2Page , any>(component,'ngOnInit').and.callThrough()

    sessionStorage.setItem("tabé_segment","random")

    const ingredientServiceSpy = spyOn(ingredientService,'getSizeArrayIngredients').and.returnValue(of(10))

    component.ngOnInit()
    tick()
    expect(ingredientServiceSpy).toHaveBeenCalled()
  }))

  it('should call loadIngredients method', fakeAsync( () => {
    const pageIndex = 0
    const pageSize = 20
    const ingredientServiceSpy = spyOn(ingredientService,'getAllIngredients').and.returnValue(of(mockIngredientList))
    component.loadIngredients()
    tick()
    ingredientService.getAllIngredients( pageIndex , pageSize )
    tick()
    expect(ingredientServiceSpy).toHaveBeenCalled()
  }));

  it('should call bookmark method', fakeAsync( () => {
    spyOn<Tab2Page , any>(component,'bookmark').and.callThrough()
    sessionStorage.setItem("userId","2")

    const item = 
    {
      isBookmarked:true
    }
    expect(item.isBookmarked).toBeTrue()

    component.bookmark(event , item)
    expect(component.bookmark).toHaveBeenCalled()

    const userId = parseInt(sessionStorage.getItem("userId"))
    fixture.detectChanges()
    expect(sessionStorage.setItem).toHaveBeenCalled()
    expect(sessionStorage.getItem).toHaveBeenCalled()
    expect(userId).not.toEqual(null)
  }));
  
  it('should call bookmark method', fakeAsync( () => {
    spyOn<Tab2Page , any>(component,'bookmark').and.callThrough()

    const item = 
    {
      isBookmarked:false
    }
    expect(item.isBookmarked).toBeFalse()

    component.bookmark(event , item)
    expect(component.bookmark).toHaveBeenCalled()

    sessionStorage.setItem("userId",null)
    const userId = sessionStorage.getItem("userId")
    expect(userId).toEqual(null)
  }));

  it('should call detail method', fakeAsync( () => {
    spyOn<Tab2Page , any>(component,'detail').and.callThrough()
    const id = 1
    
    component.detail( event , id )

    const ingredientServiceSpy = spyOn(ingredientService,'getIngredientById').and.returnValue(of(mockIngredient))
    
    tick()
    ingredientService.getIngredientById(id)
    tick()
    expect(ingredientServiceSpy).toHaveBeenCalled()
    expect(component.detail).toHaveBeenCalled()
  }));

  it('should call expand method', () => {
    spyOn<Tab2Page , any>(component,'expand').and.callThrough()

    const mockExpanded = 
    {
      expanded: false
    }

    component.expand(event,mockExpanded)
    
    expect(component.expand).toHaveBeenCalled()
  });

  it('should call saveTab method', () => {
    const spy = spyOn<Tab2Page , any>(component,'saveTab').and.callThrough()

    const tab = "card"

    component.saveTab(tab)

    expect(spy).toHaveBeenCalled()
  });
});
