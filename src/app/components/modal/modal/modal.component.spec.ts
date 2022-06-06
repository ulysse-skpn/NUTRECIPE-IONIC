import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent
  let fixture: ComponentFixture<ModalComponent>
  let el:HTMLElement

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ],
      imports: [IonicModule.forRoot() , ReactiveFormsModule , FormsModule , BrowserModule , CommonModule ]
    }).compileComponents();

    
    fixture = TestBed.createComponent(ModalComponent)
    component = fixture.componentInstance
    
    fixture.detectChanges()
  }));

  it('should create Modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should call close method', () => {
    spyOn<ModalComponent,any>(component,'close').and.callThrough()
    el = fixture.debugElement.query(By.css(".close")).nativeElement
    el.click()
    expect(component.close).toHaveBeenCalled()
  });
  
  it('should call ngOnInit method when the item is an ingredient', () => {
    spyOn<ModalComponent,any>(component,'ngOnInit')
    component.type = 'ingredient-details'
    expect(component.type).toEqual("ingredient-details")
  });

  it('should call ngOnInit method when the item is a recipe', () => {
    spyOn<ModalComponent,any>(component,'ngOnInit')
    component.type = 'recipe-details'
    expect(component.type).toEqual("recipe-details")
  });

  it('should call removeSpecialchars method', () => {
    spyOn<ModalComponent,any>(component,'removeSpecialChars').and.callThrough()
    component.removeSpecialChars("test--")
    expect(component.removeSpecialChars).toHaveBeenCalled()
  });

});
