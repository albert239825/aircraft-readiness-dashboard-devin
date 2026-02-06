import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'hasAnyRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const route: any = { data: { roles: ['maintainer', 'admin'] } };
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access for maintainer role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasAnyRole.and.returnValue(true);

    const route: any = { data: { roles: ['maintainer', 'admin'] } };
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
    expect(authService.hasAnyRole).toHaveBeenCalledWith(['maintainer', 'admin']);
  });

  it('should allow access for admin role', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasAnyRole.and.returnValue(true);

    const route: any = { data: { roles: ['maintainer', 'admin'] } };
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
  });

  it('should block access for viewer role and redirect to aircraft', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.hasAnyRole.and.returnValue(false);

    const route: any = { data: { roles: ['maintainer', 'admin'] } };
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/aircraft']);
  });

  it('should allow access if no roles are required', () => {
    authService.isAuthenticated.and.returnValue(true);

    const route: any = { data: {} };
    const state: any = {};

    const result = guard.canActivate(route, state);

    expect(result).toBeTrue();
  });
});
