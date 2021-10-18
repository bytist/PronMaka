import { DebugElement, PipeTransform, Pipe } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { FormErrorsModule } from '@spartacus/storefront';

import {
  UserService,
  RoutingService,
  I18nTestingModule,
} from '@spartacus/core';

import { MakaForgotPasswordComponent } from './maka-forgot-password.component';

class MockUserService {}
class MockRoutingService {}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('MakaForgotPasswordComponent', () => {
  let component: MakaForgotPasswordComponent;
  let fixture: ComponentFixture<MakaForgotPasswordComponent>;
  let form: DebugElement;
  let userEmail: AbstractControl;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaForgotPasswordComponent, MockUrlPipe],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: RoutingService, useClass: MockRoutingService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaForgotPasswordComponent);
    component = fixture.componentInstance;
    form = fixture.debugElement.query(By.css('form'));

    component.ngOnInit();
    userEmail = component.forgotPasswordForm.controls['userEmail'];
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
