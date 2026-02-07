import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const route: any = {};
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return false and redirect to /login when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const route: any = {};
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not redirect when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const route: any = {};
    const state: any = {};

    guard.canActivate(route, state);

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect exactly once when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const route: any = {};
    const state: any = {};

    guard.canActivate(route, state);

    expect(router.navigate).toHaveBeenCalledTimes(1);
  });
});
