import { DebugElement, PipeTransform, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  RoutingService,
  UserService,
} from '@spartacus/core';
import { of } from 'rxjs';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaResetPasswordFormComponent } from './maka-reset-password-form.component';

class MockUserService {
  isPasswordReset() {
    return of();
  }
  resetPassword() {}
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}


const router = {
  state: {
    url: '/test',
    queryParams: { token: 'test token' },
  },
};
class MockRoutingService {
  getRouterState() {
    return of(router);
  }
  go() {}
}

describe('MakaResetPasswordFormComponent', () => {
  let component: MakaResetPasswordFormComponent;
  let fixture: ComponentFixture<MakaResetPasswordFormComponent>;

  let userService: UserService;
  let routingService: RoutingService;

  let form: DebugElement;
  let password: AbstractControl;
  let rePassword: AbstractControl;

  const validPassword = 'test1234Test@';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaResetPasswordFormComponent, MockUrlPipe],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaResetPasswordFormComponent);
    component = fixture.componentInstance;

    form = fixture.debugElement.query(By.css('form'));
    password = component.resetPasswordForm.controls['password'];
    rePassword = component.resetPasswordForm.controls['repassword'];

    userService = TestBed.inject(UserService);
    routingService = TestBed.inject(RoutingService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
