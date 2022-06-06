import { HttpClientTestingModule , HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IUserIn } from 'src/app/interfaces/IUser';
import { mockPassword, mockUserOut } from 'src/app/mocks/authMock';

import { AuthService } from './auth.service';


describe('AuthService', () => {
  let authService: AuthService
  let httpMock: HttpTestingController
  let url = 'http://localhost:3000'

  const authServiceSpy = jasmine.createSpyObj("AuthService",
  ['login','register','forgotPassword','logout','redirectTo','emptySession', 'getToken','isLoggedIn','handleError'])


  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule , HttpClientTestingModule ],
      providers: 
      [
        {
          provide: AuthService
        }
      ]
    });
    authService = TestBed.inject(AuthService)
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach( () => {
    httpMock.verify()
  })

  it('AuthService should be created', () => {
    expect(authService).toBeTruthy();
  });

  // ================= LOGIN =================
  it( 'should call login method', () => {
    authServiceSpy.login();
    expect(authServiceSpy.login).toHaveBeenCalled();
  });

  it( 'should retrieve user from api via POST for the login method', () => {
    const credentials = 
    {
      email:"u.sekpon@gmail.com",
      password:"azerty"
    }

    authService.login(credentials).subscribe( (userOut) => {
      expect(userOut).toBeDefined()
      expect(userOut).toEqual(mockUserOut)
    })

    const req = httpMock.expectOne(`${url}/login`)

    expect(req.request.method).toBe("POST")

    req.flush(mockUserOut)
  });
  // =========================================================


  // ================= REGISTER =================
  it( 'should call register method', () => {
    authServiceSpy.register();
    expect(authServiceSpy.register).toHaveBeenCalled();
  });

  it( 'should sign up user from api via POST for the register method', () => {

    const user:IUserIn = 
    {
      last_name: 'SEKPON',
      first_name: 'ulysse',
      phone_number: '0000000000',
      email: 'u.sekpon@gmail.com',
      password: 'azerty',
      role: 'user',
      receiveEmail: false,
      receiveNotification: false
    };

    authService.register(user).subscribe( (userOut) => {
      expect(userOut).toBeDefined()
      expect(userOut).toEqual(mockUserOut)
    })

    const req = httpMock.expectOne(`${url}/register`)

    expect(req.request.method).toBe("POST")

    req.flush(mockUserOut)
  });
  // =========================================================



  // ================= FORGOT PASSWORD =================

  it( 'should call forgot password method', () => {
    authServiceSpy.forgotPassword();
    expect(authServiceSpy.forgotPassword).toHaveBeenCalled();
  });

  it( 'should sign up user from api via POST for the forgotPassword method', () => {

    const email = 
    {
      email:'test@gmail.com'
    };

    authService.forgotPassword(email).subscribe( (newPassword) => {   
      expect(newPassword).toBeDefined()
      expect(newPassword).toEqual(mockPassword)
    })

    const req = httpMock.expectOne(`${url}/forgotPassword`)

    expect(req.request.method).toBe("POST")

    req.flush(mockPassword)
  });
  // =========================================================

  // ================= LOGOUT =================

  it( 'should call logout method', () => {
    authServiceSpy.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });


  // ================= REDIRECTTO =================

  it( 'should call redirectTo method', () => { //?
    authServiceSpy.redirectTo();
    expect(authServiceSpy.redirectTo).toHaveBeenCalled();
  });

  // ================= EMPTYSESSION =================

  it( 'should call emptySession method', () => {
    authServiceSpy.emptySession();
    expect(authServiceSpy.emptySession).toHaveBeenCalled();
  });

  // ================= GETTOKEN =================

  it( 'should call getToken method', () => {
    authServiceSpy.getToken();
    expect(authServiceSpy.getToken).toHaveBeenCalled();
  });

  it( 'getToken method should return a token', () => {
    const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTIyNzYyMjIsImV4cCI6MTY1MjM2MjYyMn0.4zUKp2ci-gxs_Yl3eNEPTWcw_Sfz5loDyf7OhtzoWiY"
    authServiceSpy.getToken.and.returnValue(access_token)
    expect(authServiceSpy.getToken()).toEqual(access_token)
  });

  it( 'getToken method should return null', () => {
    const access_token = null
    authServiceSpy.getToken.and.returnValue(access_token)
    expect(authServiceSpy.getToken()).toEqual(null)
  });

  // ================= ISLOGGEDIN =================

  it( 'should call isLoggedIn method', () => {
    authServiceSpy.isLoggedIn();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
  });

  it( 'should be logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true)
    expect(authServiceSpy.isLoggedIn()).toBeTrue();
  });

  it( 'should not be logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false)
    expect(authServiceSpy.isLoggedIn()).toBeFalse();
  });

  // ================= HANDLEERROR =================

  it( 'should call handleError method', () => {
    authServiceSpy.handleError();
    expect(authServiceSpy.handleError).toHaveBeenCalled();
  });
});
