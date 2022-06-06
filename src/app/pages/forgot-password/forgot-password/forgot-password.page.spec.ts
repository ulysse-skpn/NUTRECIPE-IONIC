import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPage } from './forgot-password.page'

import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { JwtModule } from "@auth0/angular-jwt";
import { By } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { LoginPage } from '../../login/login/login.page';


export function tokenGetter() {
    return sessionStorage.getItem("access_token");
}

describe('ForgotPasswordPage', () => {
    let component: ForgotPasswordPage;
    let fixture: ComponentFixture<ForgotPasswordPage>;
    let el:HTMLElement
    let authService:AuthService
    let authServiceSpy:any

    beforeEach(waitForAsync( () => {

        authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService',
        {
            forgotPassword: of("new_password")
        })

        TestBed.configureTestingModule({
        declarations: [ ForgotPasswordPage ],
        imports: [IonicModule.forRoot() ,  HttpClientTestingModule , ReactiveFormsModule , FormsModule , RouterTestingModule.withRoutes([
            {
                path:'login' , component:LoginPage
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
                provide:AuthService , useValue: authServiceSpy
            }
        ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordPage);
        component = fixture.componentInstance;
        fixture.detectChanges();

        authService = TestBed.inject(AuthService)
    }));

    it('should create Forgot Password Page', () => {
        expect(component).toBeTruthy();
    });

    it('should call goBack', fakeAsync(() => {
        fixture.detectChanges()
        spyOn<ForgotPasswordPage , any>(component,'goBack').and.callThrough()
        el = fixture.debugElement.query(By.css('.returnButton')).nativeElement
        el.click()
        expect(component.goBack).toHaveBeenCalled()


        const email = 
        {
            email: "test@test.com"
        }

        authService.forgotPassword(email).subscribe( async(new_password) => {
            fixture.whenStable().then( () => {
                fixture.detectChanges()
                expect(new_password).toBeDefined()
            })
        })

    }));

    it('should call getNewPassword', () => {
        component.forgotPasswordFormGroup.controls['emailControl'].setValue('test@test.com')
        spyOn<ForgotPasswordPage , any>(component,'getNewPassword').and.callThrough()
        component.getNewPassword()
        expect(component.getNewPassword).toHaveBeenCalled()
    });

    it('should call getNewPassword with invalid form', () => {
        component.forgotPasswordFormGroup.controls['emailControl'].setValue(null)
        spyOn<ForgotPasswordPage , any>(component,'getNewPassword').and.callThrough()
        component.getNewPassword()
        expect(component.getNewPassword).toHaveBeenCalled()

        const form = component.forgotPasswordFormGroup
        expect(form.valid).toBeFalse()
    });

    it('on startup , newPassword should be an empty string', () => {
        expect(component.newPassword.length).toEqual(0)
    });

    it('form should be valid', () => {
        component.forgotPasswordFormGroup.controls['emailControl'].setValue('test@test.com');
        expect(component.forgotPasswordFormGroup.valid).toBeTruthy();
    });

    it('form should be invalid', () => {
        component.forgotPasswordFormGroup.controls['emailControl'].setValue(null);
        expect(component.forgotPasswordFormGroup.invalid).toBeTruthy();
    });

});
