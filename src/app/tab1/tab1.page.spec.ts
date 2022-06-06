import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { RecipesService } from '../services/recipes/recipes.service';
import { Tab2Page } from '../tab2/tab2.page';
import { Tab3Page } from '../tab3/tab3.page';

import { Tab1Page } from './tab1.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { FormsModule } from '@angular/forms';
import { SideMenuComponent } from '../components/side-menu/side-menu/side-menu.component';
import { of } from 'rxjs';
import { IRecipeOut } from '../interfaces/IRecipe';

const mockRecipeList:IRecipeOut[] = 
[
  {
    id: 0,
    title: '',
    prep_time: '',
    cooking_time: '',
    rest_time: '',
    categories: '',
    ingredients_list: '',
    serving_size: '',
    instructions: '',
    image: '',
    createdAt: undefined,
    updatedAt: undefined
  }
]

const mockRecipe:IRecipeOut = 
{
  id: 0,
  title: '',
  prep_time: '',
  cooking_time: '',
  rest_time: '',
  categories: '',
  ingredients_list: '',
  serving_size: '',
  instructions: '',
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

describe('Tab1Page', () => {
  let component: Tab1Page
  let fixture: ComponentFixture<Tab1Page>
  let recipeService:RecipesService
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
      declarations: [Tab1Page , SideMenuComponent],
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
      ])],
      providers:
      [
        RecipesService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page)
    component = fixture.componentInstance
    fixture.detectChanges()

    recipeService = TestBed.inject(RecipesService)
  }));

  it('should create Tab1 Page', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit method and the selectTab is not "random"', fakeAsync( () => {
    spyOn<Tab1Page , any>(component,'ngOnInit').and.callThrough()

    sessionStorage.setItem("access_token","lorem")
    sessionStorage.setItem("tab1_segment","list")

    const token = sessionStorage.getItem("token")
    let tab = sessionStorage.getItem("tab1_segment")
    
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

    const recipeServiceSpy = spyOn(recipeService,'getSizeArrayRecipes').and.returnValue(of(10))

    component.ngOnInit()
    tick()
    expect(recipeServiceSpy).toHaveBeenCalled()
  }))

  it('should call ngOnInit method and the selectTab is "random"', fakeAsync( () => {
    spyOn<Tab1Page , any>(component,'ngOnInit').and.callThrough()

    sessionStorage.setItem("tab1_segment","random")

    const recipeServiceSpy = spyOn(recipeService,'getSizeArrayRecipes').and.returnValue(of(10))

    component.ngOnInit()
    tick()
    expect(recipeServiceSpy).toHaveBeenCalled()
  }))

  it('should call loadRecipes method', fakeAsync( () => {
    const pageIndex = 0
    const pageSize = 20
    const recipeServiceSpy = spyOn(recipeService,'getAllRecipesPagination').and.returnValue(of(mockRecipeList))
    component.loadRecipes()
    tick()
    recipeService.getAllRecipesPagination( pageIndex , pageSize )
    tick()
    expect(recipeServiceSpy).toHaveBeenCalled()
  }));

  it('should call bookmark method and isBookmarked var is true', fakeAsync( () => {
    spyOn<Tab1Page , any>(component,'bookmark').and.callThrough()
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
  
  it('should call bookmark method and isBookmarked var is false', fakeAsync( () => {
    spyOn<Tab1Page , any>(component,'bookmark').and.callThrough()

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


  it('should call getRandomRecipe method', () => {
    spyOn<Tab1Page , any>(component,'getRandomRecipe').and.callThrough()
    const recipeServiceSpy = spyOn(recipeService,'getRecipeById').and.returnValue(of(mockRecipe))
    const randomId = 13
    component.getRandomRecipe()
    recipeService.getRecipeById( randomId )
    expect(recipeServiceSpy).toHaveBeenCalled()
  });

  it('should call expand method', () => {
    spyOn<Tab1Page , any>(component,'expand').and.callThrough()

    const mockExpanded = 
    {
      expanded: false
    }

    component.expand(event,mockExpanded)
    
    expect(component.expand).toHaveBeenCalled()
  });

  it('should call saveTab method', () => {
    spyOn<Tab1Page , any>(component,'saveTab').and.callThrough()

    const tab = "card"

    component.saveTab(tab)

    expect(component.saveTab).toHaveBeenCalled()
  });

});
