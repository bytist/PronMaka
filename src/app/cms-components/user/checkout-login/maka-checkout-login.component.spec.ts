import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import {
  ActiveCartService,
  AuthRedirectService,
  I18nTestingModule,
  User,
} from '@spartacus/core';
import { of } from 'rxjs';
import { FormErrorsModule } from '@spartacus/storefront';
import { MakaCheckoutLoginComponent } from './maka-checkout-login.component';
import createSpy = jasmine.createSpy;

class MockActiveCartService {
  addEmail = createSpy('MockCartService.addEmail');
  getAssignedUser() {
    return of();
  }
  isGuestCart(): Boolean {
    return false;
  }
}
class MockRedirectAfterAuthService {
  redirect = createSpy('AuthRedirectService.redirect');
}

@Component({
  selector: 'app-maka-login-form',
  template: '',
})
class MockMakaLoginForm {
  @Input() coreVersion: boolean;
}

const testEmail = 'john@acme.com';
const wrongEmail = 'wrong';

describe('MakaCheckoutLoginComponent', () => {
  let component: MakaCheckoutLoginComponent;
  let fixture: ComponentFixture<MakaCheckoutLoginComponent>;
  let activeCartService: ActiveCartService;
  let authRedirectService: AuthRedirectService;
  let controls: { [key: string]: AbstractControl };
  let email: AbstractControl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, I18nTestingModule, FormErrorsModule],
      declarations: [MakaCheckoutLoginComponent, MockMakaLoginForm],
      providers: [
        { provide: ActiveCartService, useClass: MockActiveCartService },
        {
          provide: AuthRedirectService,
          useClass: MockRedirectAfterAuthService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCheckoutLoginComponent);
    component = fixture.componentInstance;
    activeCartService = TestBed.inject(ActiveCartService);
    authRedirectService = TestBed.inject(AuthRedirectService);
  });

  beforeEach(() => {
    controls = component.checkoutLoginForm.controls;
    email = controls['email'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(email.value).toBe('');
  });

  describe('submitting form', () => {
    beforeEach(() => {
      spyOn(activeCartService, 'getAssignedUser').and.returnValue(
        of({ name: 'guest', uid: 'john@acme.com' } as User)
      );
      spyOn(activeCartService, 'isGuestCart').and.returnValue(true);
    });

    it('should work, when form is valid', () => {
      email.setValue(testEmail);
      fixture.detectChanges();

      component.onSubmit();
      expect(activeCartService.addEmail).toHaveBeenCalledWith(testEmail);
      expect(authRedirectService.redirect).toHaveBeenCalled();
    });

    it('should not work, when form is not valid', () => {
      email.setValue(wrongEmail);
      fixture.detectChanges();

      component.onSubmit();
      expect(activeCartService.addEmail).not.toHaveBeenCalled();
      expect(authRedirectService.redirect).not.toHaveBeenCalled();
    });
  });
});
