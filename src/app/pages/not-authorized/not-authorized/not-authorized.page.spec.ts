import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from '../../login/login/login.page';

import { NotAuthorizedPage } from './not-authorized.page';

describe('NotAuthorizedPage', () => {
  let component: NotAuthorizedPage
  let fixture: ComponentFixture<NotAuthorizedPage>
  let el:HTMLElement
  let routerMock: RouterTestingModule

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAuthorizedPage ],
      imports: [IonicModule.forRoot() , RouterTestingModule.withRoutes([
        {
          path:'login' , component: LoginPage
        }
      ])]
    }).compileComponents();

    fixture = TestBed.createComponent(NotAuthorizedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create Not authorized Page', () => {
    expect(component).toBeTruthy();
  });

  it('should call goToLogin method', async() => {
    spyOn(component,'goToLogin').and.callThrough()
    el = fixture.debugElement.query(By.css(".goToLogin")).nativeElement
    el.click()
    expect(el).toBeDefined()

    fixture.whenStable().then( () => {
      fixture.detectChanges()
      expect(component.goToLogin).toHaveBeenCalled()
    })  

  });
});
