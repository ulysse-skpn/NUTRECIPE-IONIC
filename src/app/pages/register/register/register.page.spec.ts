import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';

import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { JwtModule } from "@auth0/angular-jwt";
import { By } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { IUserOut } from 'src/app/interfaces/IUser';

export function tokenGetter() {
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

describe('RegisterPage', () => {
  let component: RegisterPage
  let fixture: ComponentFixture<RegisterPage>
  let el:HTMLElement
  let authService:AuthService

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [ RegisterPage ],
      imports: [IonicModule.forRoot() , RouterTestingModule , HttpClientTestingModule , ReactiveFormsModule , FormsModule , JwtModule.forRoot({
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
      })],
      providers:
      [
        {
          provide: AuthService
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage)
    component = fixture.componentInstance
    fixture.detectChanges()
    authService = TestBed.inject(AuthService)
  }));

  it('should create Register Page', () => {
    expect(component).toBeTruthy();
  });

  it('should call goBack', () => {
    spyOn<RegisterPage , any>(component,'goBack').and.callThrough()
    el = fixture.debugElement.query(By.css('.returnButton')).nativeElement
    el.click()
    expect(component.goBack).toHaveBeenCalled()
  });

  it('should call onFormSubmit and form is valid', fakeAsync( () => {
    spyOn<RegisterPage , any>(component,'onFormSubmit').and.callThrough()

    component.registerFormGroup.controls['lastNameControl'].setValue('sekpon')
    component.registerFormGroup.controls['firstNameControl'].setValue('ulysse')
    component.registerFormGroup.controls['phoneNumberControl'].setValue('0102030405')
    component.registerFormGroup.controls['emailControl'].setValue('test@test.com')
    component.registerFormGroup.controls['passwordControl'].setValue('azerty')
    component.registerFormGroup.controls['passwordConfirmControl'].setValue('azerty')
    fixture.detectChanges()

    expect(component.registerFormGroup.valid).toBeTrue()

    component.buttonVisible = false
    
    el = fixture.debugElement.query(By.css('.valButton')).nativeElement
    el.click()
    expect(component.onFormSubmit).toHaveBeenCalled()

    const authServiceSpy = spyOn(authService,'register').and.returnValue(of(userOut))
    
    component.onFormSubmit()
    tick()
    expect(authServiceSpy).toHaveBeenCalled()
    sessionStorage.setItem("access_token",'lorem')
    sessionStorage.setItem("expiresIn",'320')
    const access_token = sessionStorage.getItem("access_token")
    const expiresIn = sessionStorage.getItem("expiresIn")
    expect(access_token).toEqual(sessionStorage.getItem("access_token"))
    expect(expiresIn).toEqual(sessionStorage.getItem("expiresIn"))
  }));

  it('should call onFormSubmit and form is invalid', () => {
    spyOn<RegisterPage , any>(component,'onFormSubmit').and.callThrough()

    component.registerFormGroup.controls['lastNameControl'].setValue(null)
    component.registerFormGroup.controls['firstNameControl'].setValue(null)
    component.registerFormGroup.controls['phoneNumberControl'].setValue(null)
    component.registerFormGroup.controls['emailControl'].setValue(null)
    component.registerFormGroup.controls['passwordControl'].setValue(null)
    component.registerFormGroup.controls['passwordConfirmControl'].setValue("TEST")
    fixture.detectChanges()

    el = fixture.debugElement.query(By.css(".valButton")).nativeElement
    el.click()
    expect(component.registerFormGroup.valid).toBeFalse()
  });

  it('should call onFormSubmit and form is invalid', () => {
    spyOn<RegisterPage , any>(component,'onFormSubmit').and.callThrough()

    component.registerFormGroup.controls['passwordControl'].setValue(null)
    component.registerFormGroup.controls['passwordConfirmControl'].setValue(null)
    fixture.detectChanges()

    el = fixture.debugElement.query(By.css(".valButton")).nativeElement
    el.click()
    expect(component.registerFormGroup.valid).toBeFalse()
  });

  it('form should be valid', () => {
    component.registerFormGroup.controls['lastNameControl'].setValue('sekpon');
    component.registerFormGroup.controls['firstNameControl'].setValue('ulysse');
    component.registerFormGroup.controls['phoneNumberControl'].setValue('0102030405');
    component.registerFormGroup.controls['emailControl'].setValue('test@test.com');
    component.registerFormGroup.controls['passwordControl'].setValue('azerty');
    component.registerFormGroup.controls['passwordConfirmControl'].setValue('azerty');
    expect(component.registerFormGroup.valid).toBeTruthy();
  });

  it('form should be invalid', () => {
    component.registerFormGroup.controls['lastNameControl'].setValue(null)
    component.registerFormGroup.controls['firstNameControl'].setValue(null)
    component.registerFormGroup.controls['phoneNumberControl'].setValue(null)
    component.registerFormGroup.controls['emailControl'].setValue(null)
    component.registerFormGroup.controls['passwordControl'].setValue(null)
    component.registerFormGroup.controls['passwordConfirmControl'].setValue(null)
    expect(component.registerFormGroup.invalid).toBeTruthy()
  });

  // it('form should be invalid even if some inputs are filled', () => {
  //   component.registerFormGroup.controls['lastNameControl'].setValue('sekpon')
  //   component.registerFormGroup.controls['firstNameControl'].setValue('ulysse')
  //   component.registerFormGroup.controls['phoneNumberControl'].setValue('0102030405')
  //   component.registerFormGroup.controls['emailControl'].setValue(null)
  //   component.registerFormGroup.controls['passwordControl'].setValue(null)
  //   component.registerFormGroup.controls['passwordConfirmControl'].setValue(null)
  //   expect(component.registerFormGroup.invalid).toBeTruthy()
  // });

  it('form should be invalid if the password and the confirm password inputs are not the same', () => {
    component.registerFormGroup.controls['lastNameControl'].setValue('sekpon')
    component.registerFormGroup.controls['firstNameControl'].setValue('ulysse')
    component.registerFormGroup.controls['phoneNumberControl'].setValue('0102030405')
    component.registerFormGroup.controls['emailControl'].setValue('test@test.com')
    component.registerFormGroup.controls['passwordControl'].setValue('azerty')
    component.registerFormGroup.controls['passwordConfirmControl'].setValue(null)
    expect(component.registerFormGroup.invalid).toBeTruthy()
  });

});
