import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RouteGuard } from './route.guard';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

describe('RouteGuard', () => {
  let routeGuard: RouteGuard
  let routeMock: any = { snapshot: {}};
  let routeStateMock: any = { snapshot: {}, url: '/login'};

  const authServiceSpy = jasmine.createSpyObj("AuthService",
  ['isLoggedIn'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RouteGuard ,
      {
        provide: Router , useValue:routeMock
      },
      {
        provide: AuthService , useValue: authServiceSpy
      }
    ]
    });

    routeGuard = TestBed.inject(RouteGuard)
  });

  it('Route guard service should be created', () => {
    expect(routeGuard).toBeTruthy();
  });

  it('should allow the authenticated user to access protected routes', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true)
    expect(routeGuard.canActivate(routeMock, routeStateMock)).toEqual(true)
  });

});
