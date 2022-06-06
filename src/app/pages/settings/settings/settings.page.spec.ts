import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { IUser } from 'src/app/interfaces/IUser';
import { RouteGuard } from 'src/app/services/route-guard/route.guard';
import { UsersService } from 'src/app/services/users/users.service';
import { NotAuthorizedPage } from '../../not-authorized/not-authorized/not-authorized.page';

import { SettingsPage } from './settings.page';

function tokenGetter() {
  return sessionStorage.getItem("access_token");
}


describe('SettingsPage', () => {
  let component: SettingsPage
  let fixture: ComponentFixture<SettingsPage>
  let store = {}

  const mockUser: IUser = 
  {
    userId: 0,
    last_name: '',
    first_name: '',
    phone_number: '',
    email: '',
    password: '',
    role: '',
    receiveEmail: false,
    receiveNotification: false,
    created_at: '',
    updated_at: ''
  }

  let userServiceSpy:any

  
  beforeEach(waitForAsync(() => {
    
    spyOn(sessionStorage, 'setItem').and.callFake((key, value) => {
      store[key] = value
      return store
    })
  
    spyOn(sessionStorage,'getItem').and.callFake( (key) => {
      return store[key] || null
    })

    userServiceSpy = jasmine.createSpyObj<UsersService>('UserService',
    {
      getUserById: of(mockUser),
      deleteUser: of([1]),
    })

    TestBed.configureTestingModule({
      declarations: [ SettingsPage ],
      imports: [IonicModule.forRoot() , HttpClientTestingModule , ReactiveFormsModule , RouterTestingModule.withRoutes([
        {
          path:'settings' , component: SettingsPage
        },
        {
          path:'notauthorized' , component: NotAuthorizedPage
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
      [ RouteGuard , 
        {
          provide: UsersService , useValue: userServiceSpy
        },
        {
          provide: ModalController 
        },
        {
          provide: ToastController 
        },
        {
          provide:JwtHelperService
        }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage)
    component = fixture.componentInstance

    fixture.detectChanges()
  }));


  it('should create Setting Page', fakeAsync( () => {
    tick()
    expect(component).toBeTruthy()
  }))

  it('should call modify method when form is disabled', () => {
    spyOn<SettingsPage,any>(component,'modify').and.callThrough()

    component.isDisabled = true

    component.modify()

    if( component.isDisabled === true )
    {
      expect(component.isDisabled).toBeTrue()
      expect(component.modifyButton).toEqual("Modifier")
    }

    component.isDisabled = false

    component.modify()

    if( component.isDisabled === false )
    {
      expect(component.isDisabled).toBeFalse()
      expect(component.modifyButton).toEqual("Annuler")
    }

    expect(component.modify).toHaveBeenCalled()
  });

  it('should call delete method', () => {
    const spy = spyOn(component,'deleteUser').and.callThrough()
    component.deleteUser()
    expect(spy).toHaveBeenCalled()
  });

  it('should call get errorMeessage method', () => {
    const spy = spyOnProperty(component,'errorMessage','get')
    expect(spy).toBeTruthy()
  });

  it('should call getFormValue method', () => {
    spyOn<SettingsPage,any>(component,'getFormValue').and.callThrough()
    component.getFormValue()
    expect(component.getFormValue).toHaveBeenCalled()
  });

});
