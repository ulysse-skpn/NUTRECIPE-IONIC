import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { IUserOut } from '../../../interfaces/IUser';

function tokenGetter() {
  return sessionStorage.getItem("access_token");
}


const userOut:IUserOut = 
{
  user: 
  {
    userId:1,
    last_name: 'abcdef',
    first_name: 'ghijkl',
    phone_number: '0102030405',
    email: 'azert@azerty.com',
    password: 'qsdfgh',
    role: 'user',
    receiveEmail: false,
    receiveNotification: false,
    created_at:"2022-01-01",
    updated_at:"2022-01-01"
  },
  access_token: '',
  expires_in: 0
}

const userOut2:IUserOut = 
{
  user: 
  {
    userId:1,
    last_name: 'mnopqr',
    first_name: 'stuvwx',
    phone_number: '0504030201',
    email: 'azert@azerty.com',
    password: 'qsdfgh',
    role: 'admin',
    receiveEmail: true,
    receiveNotification: true,
    created_at:"2022-01-01",
    updated_at:"2022-01-01"
  },
  access_token: '',
  expires_in: 0
}

describe('LoginPage', () => {
  let component: LoginPage
  let fixture: ComponentFixture<LoginPage>
  let el:HTMLElement
  let jwtHelperStub:any
  let authService:AuthService


  beforeEach(waitForAsync(() => {

    sessionStorage.setItem("access_token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTI4OTUyNTYsImV4cCI6MTY1Mjk4MTY1Nn0.0wxSiAeDO4_V-4i5lzB1Z1Mugp3jpf8Z5GIOhy0XZy8")
    sessionStorage.setItem("expiresIn","8200")

    jwtHelperStub = 
    {
      isTokenExpired: jasmine.createSpy('isTokenExpired').and.returnValue(false)
    }

    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot() , HttpClientTestingModule , RouterModule , ReactiveFormsModule ,  RouterTestingModule.withRoutes([
        {
          path:'tabs' , component: TabsPage
        }
      ]) , JwtModule.forRoot({
        config:
        {
          tokenGetter: tokenGetter,
          allowedDomains:
          [
            'https://127.0.0.1:3000',
            'https://localhost:4000',
            'https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
          ]
        }
      }) ],
      providers:
      [
        {
          provide: JwtHelperService
        },
        {
          provide: AuthService
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage)
    component = fixture.componentInstance

    authService = TestBed.inject(AuthService)
  }));

  it('should create Login Page', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit method but the token is expired', () => {
    fixture.detectChanges()
    spyOn<LoginPage,any>(component,'ngOnInit')

    const token = sessionStorage.getItem("access_token")
    const isExpired = jwtHelperStub.isTokenExpired(token)

    if( token && isExpired === false )
    {
      expect(token).not.toEqual(null)
      expect(isExpired).toEqual(false)
    }
  });

  it('should call goToRegister method', async() => {
    fixture.detectChanges()
    spyOn(component,'goToRegister').and.callThrough()
    el = fixture.debugElement.query(By.css(".goToRegisterButton")).nativeElement
    el.click()
    expect(el).toBeDefined()

    fixture.whenStable().then( () => {
      fixture.detectChanges()
      expect(component.goToRegister).toHaveBeenCalled()
    })  
  });

  it('should call goToForgotPassword method', async() => {
    fixture.detectChanges()
    spyOn(component,'goToForgotPassword').and.callThrough()
    el = fixture.debugElement.query(By.css(".goToForgotPasswordButton")).nativeElement
    el.click()
    expect(el).toBeDefined()

    fixture.whenStable().then( () => {
      fixture.detectChanges()
      expect(component.goToForgotPassword).toHaveBeenCalled()
    })  
  });

  it('should call onFormSubmit method but form is invalid', () => {
    fixture.detectChanges()
    spyOn(component,'onFormSubmit').and.callThrough()
    component.loginFormGroup.controls['emailControl'].setValue('')
    component.loginFormGroup.controls['passwordControl'].setValue('')

    el = fixture.debugElement.query(By.css(".valButton")).nativeElement
    el.click()

    fixture.detectChanges()

    expect(component.onFormSubmit).toHaveBeenCalled()
    expect(component.loginFormGroup.valid).toBeFalse()
  });

  it('should call onFormSubmit method and form is valid (user)', fakeAsync( () => {
    fixture.detectChanges()
    spyOn(component,'onFormSubmit').and.callThrough()
    component.loginFormGroup.controls['emailControl'].setValue('test@test.com')
    component.loginFormGroup.controls['passwordControl'].setValue('azerty')

    el = fixture.debugElement.query(By.css(".valButton")).nativeElement
    el.click()

    fixture.detectChanges()

    expect(component.onFormSubmit).toHaveBeenCalled()
    expect(component.loginFormGroup.valid).toBeTrue()

    const authServiceSpy = spyOn(authService,'login').and.returnValue(of(userOut))
    component.onFormSubmit()
    tick()
    expect(authServiceSpy).toHaveBeenCalled()
  }));

  it('should call onFormSubmit method and form is valid (admin)', fakeAsync( () => {
    fixture.detectChanges()
    spyOn(component,'onFormSubmit').and.callThrough()
    component.loginFormGroup.controls['emailControl'].setValue('test@test.com')
    component.loginFormGroup.controls['passwordControl'].setValue('azerty')

    el = fixture.debugElement.query(By.css(".valButton")).nativeElement
    el.click()

    fixture.detectChanges()

    expect(component.onFormSubmit).toHaveBeenCalled()
    expect(component.loginFormGroup.valid).toBeTrue()

    const authServiceSpy2 = spyOn(authService,'login').and.returnValue(of(userOut2))
    component.onFormSubmit()
    tick()
    expect(authServiceSpy2).toHaveBeenCalled()
  }));

});

