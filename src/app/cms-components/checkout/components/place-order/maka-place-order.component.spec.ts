import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AuthService,
  Cart,
  I18nTestingModule,
  Order,
  RoutingService
} from '@spartacus/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormErrorsModule } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MakaPaymentMethodService } from '../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { PaymentMode, PaymentModeActive } from '../payment-method/maka-payment-method.model';
import { MakaPlaceOrderComponent } from './maka-place-order.component';
import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';

class MockCheckoutService {
  placeOrder(): void {
  }

  placeOrderConditional(): void {
  }

  getOrderDetails(): Observable<Order> {
    return of({});
  }
}

class MockRoutingService {
  go(): void {
  }
}

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('1');
  }
}

class MockActiveCartService {
  getActive(): Observable<Cart> {
    return of();
  }

  getActiveCartId(): Observable<string> {
    return of('10001');
  }

  getCartParamsRequest(): Observable<[string, string]> {
    return of(['current', 'S0111111']);
  }
}

const paypalPayment: PaymentModeActive = {
  code: 'paypal',
  name: 'PayPal',
  paymentProvider: 'PayPal',
  active: true
};

const paypalPaymentMode: PaymentMode = {
  code: 'paypal',
  name: 'PayPal',
  paymentProvider: 'PayPal'
};

class MockMakaPaymentMethodService {
  getPaymentMode(): Observable<PaymentModeActive> {
    return of(paypalPayment);
  }

  getPaymentModes(): Observable<PaymentMode[]> {
    return of([paypalPaymentMode]);
  }
}

class MockChangeDetectorRef {
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {
  }
}

describe('MakaPlaceOrderComponent', () => {
  let component: MakaPlaceOrderComponent;
  let fixture: ComponentFixture<MakaPlaceOrderComponent>;
  let controls = FormGroup['controls'];
  let mockCheckoutService: MakaCheckoutService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MockUrlPipe, MakaPlaceOrderComponent],
      providers: [
        {provide: MakaCheckoutService, useClass: MockCheckoutService},
        {provide: RoutingService, useClass: MockRoutingService},
        {provide: MakaActiveCartService, useClass: MockActiveCartService},
        {provide: MakaPaymentMethodService, useClass: MockMakaPaymentMethodService},
        {provide: AuthService, useClass: MockAuthService},
        {provide: ChangeDetectorRef, useClass: MockChangeDetectorRef}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPlaceOrderComponent);
    component = fixture.componentInstance;
    controls = component.checkoutSubmitForm.controls;
    mockCheckoutService = TestBed.inject(MakaCheckoutService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not place order when checkbox not checked', () => {
    spyOn(mockCheckoutService, 'placeOrderConditional').and.callThrough();
    controls.termsAndConditions.setValue(false);
    component.submitForm();
    expect(mockCheckoutService.placeOrderConditional).not.toHaveBeenCalled();
  });

  it('should test toggleTandC', () => {
    component.tAndCToggler = false;
    component.toggleTAndC();
    expect(component.tAndCToggler).toEqual(true);
  });

  it('should test toggleTandC', () => {
    spyOn(mockCheckoutService, 'placeOrderConditional').and.callThrough();
    controls.termsAndConditions.setValue(true);
    component.submitForm();
    expect(mockCheckoutService.placeOrderConditional).toHaveBeenCalled();
  });
});
