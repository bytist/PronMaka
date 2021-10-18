import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CheckoutService, I18nTestingModule, Order } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { MakaOrderConfirmationThankYouMessageComponent } from './maka-order-confirmation-thank-you-message.component';
import createSpy = jasmine.createSpy;

@Component({ selector: 'cx-add-to-home-screen-banner', template: '' })
class MockAddtoHomeScreenBannerComponent {}

// ToDo: This should be reviewed as part of guest checkout ticket MAKA-243
@Component({ selector: 'cx-guest-register-form', template: '' })
class MockGuestRegisterFormComponent {
  @Input() guid;
  @Input() email;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();
  getOrderDetails(): Observable<Order> {
    return of({
      code: 'test-code-412',
      guid: 'guid',
      guestCustomer: true,
      paymentInfo: { billingAddress: { email: 'test@test.com' } },
    });
  }
}

describe('OrderConfirmationComponent', () => {
  let component: MakaOrderConfirmationThankYouMessageComponent;
  let fixture: ComponentFixture<MakaOrderConfirmationThankYouMessageComponent>;

  let checkoutService: CheckoutService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        MakaOrderConfirmationThankYouMessageComponent,
        MockAddtoHomeScreenBannerComponent,
        MockGuestRegisterFormComponent,
      ],
      providers: [{ provide: CheckoutService, useClass: MockCheckoutService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      MakaOrderConfirmationThankYouMessageComponent
    );
    component = fixture.componentInstance;
    checkoutService = TestBed.inject(CheckoutService);
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  // ToDo: Fix this at the end when the CheckoutService is used
  // it('should display order code', () => {
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   expect(
  //     fixture.debugElement.query(By.css('.cx-page-title')).nativeElement
  //       .innerHTML
  //   ).toContain('test-code-412');
  // });

  // ToDo: This should be reviewed as part of guest checkout ticket MAKA-243
  // it('should display guest register form for guest user', () => {
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //
  //   expect(
  //     fixture.debugElement.query(By.css('cx-guest-register-form'))
  //   ).not.toBeNull();
  // });

  // ToDo: This should be reviewed as part of guest checkout ticket MAKA-243
  // it('should not display guest register form for login user', () => {
  //   spyOn(checkoutService, 'getOrderDetails').and.returnValue(
  //     of({ guid: 'guid', guestCustomer: false })
  //   );
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //
  //   expect(
  //     fixture.debugElement.query(By.css('cx-guest-register-form'))
  //   ).toBeNull();
  // });
});
