import { MakaPaymentDetailsSetGuard } from './maka-payment-details-set.guard';
import { ActiveCartService, AuthService, PaymentDetails, RoutesConfig, RoutingConfigService } from '@spartacus/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { CheckoutConfigService, CheckoutDetailsService, CheckoutStep, CheckoutStepType } from '@spartacus/storefront';
import { Router } from '@angular/router';
import { PaymentModeActive } from '../components/payment-method/maka-payment-method.model';
import { MakaPaymentMethodService } from '../../../shared/services/maka-payment-method/maka-payment-method.service';

const paymentModePaypal: PaymentModeActive = {
  code: 'paypal',
  name: 'Payment method',
  active: true,
  paymentProvider: 'paypal'
};

const paymentModeCard: PaymentModeActive = {
  code: 'card',
  name: 'Payment with card',
  active: true,
  paymentProvider: 'openpay'
};

const checkoutStep: CheckoutStep = {
  id: 'review-order',
  name: 'Review Order',
  routeName: 'checkoutPaymentDetails',
  type: [CheckoutStepType.REVIEW_ORDER]
};

const paymentDetails: PaymentDetails = {
  cardNumber: '41111111111111111',
  accountHolderName: 'Test'
};

const paymentDetailsEmpty: PaymentDetails = {};

const MockRoutesConfig: RoutesConfig = {
  checkoutDeliveryMode: {paths: ['checkout/delivery-mode']},
  checkoutPaymentDetails: {paths: ['checkout/payment-details']},
  checkoutReviewOrder: {paths: ['checkout/review-order']},
};

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('userId12345');
  }
}

class MockActiveCartService {
  getActiveCartId(): Observable<string> {
    return of('cartId12345');
  }
}

class CheckoutDetailsServiceStub {
  getPaymentDetails(): Observable<PaymentDetails> {
    return of();
  }
}

class MockCheckoutConfigService {
  getCheckoutStep(): CheckoutStep {
    return checkoutStep;
  }
}

class MakaPaymentMethodServiceStub {
  getPaymentMode(): Observable<PaymentModeActive> {
    return of();
  }
}

class MockRoutingConfigService {
  getRouteConfig(routeName: string) {
    return MockRoutesConfig[routeName];
  }
}

describe('MakaPaymentDetailsSetGuard', () => {
  let guard: MakaPaymentDetailsSetGuard;
  let checkoutDetailsService: CheckoutDetailsService;
  let checkoutConfigService: CheckoutConfigService;
  let routingConfigService: RoutingConfigService;
  let authService: MockAuthService;
  let router: Router;
  let activeCartService: ActiveCartService;
  let paymentMethodService: MakaPaymentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService
        },
        {
          provide: ActiveCartService,
          useClass: MockActiveCartService,
        },
        {
          provide: MakaPaymentMethodService,
          useClass: MakaPaymentMethodServiceStub,
        },
        {
          provide: CheckoutDetailsService,
          useClass: CheckoutDetailsServiceStub,
        },
        {
          provide: CheckoutConfigService,
          useClass: MockCheckoutConfigService,
        },
        {
          provide: RoutingConfigService,
          useClass: MockRoutingConfigService,
        }
      ],
      imports: [RouterTestingModule],
    });
    authService = TestBed.inject(AuthService);
    guard = TestBed.inject(MakaPaymentDetailsSetGuard);
    router = TestBed.inject(Router);
    activeCartService = TestBed.inject(ActiveCartService);
    checkoutConfigService = TestBed.inject(CheckoutConfigService);
    checkoutDetailsService = TestBed.inject(CheckoutDetailsService);
    routingConfigService = TestBed.inject(RoutingConfigService);
    paymentMethodService = TestBed.inject(MakaPaymentMethodService);
  });

  describe('when payment is paypal,', () => {
    beforeEach(() => {
      spyOn(paymentMethodService, 'getPaymentMode').and.returnValue(of(paymentModePaypal));
      spyOn(checkoutDetailsService, 'getPaymentDetails').and.returnValue(of(paymentDetails));
    });

    it('should return true automatically', (done) => {
      guard.canActivate()
        .subscribe((data) => {
          expect(data).toBeTruthy();
          done();
        });
    });
  });

  describe('when payment is openpay,', () => {
    beforeEach(() => {
      spyOn(paymentMethodService, 'getPaymentMode').and.returnValue(of(paymentModeCard));
    });

    it('should return true when payment details are present', (done) => {
      spyOn(checkoutDetailsService, 'getPaymentDetails').and.returnValue(of(paymentDetails));

      guard.canActivate()
        .subscribe((data) => {
          expect(data).toBeTruthy();
          done();
        });
    });

    it('should return previous step when payment details are not present', (done) => {
      spyOn(checkoutDetailsService, 'getPaymentDetails').and.returnValue(of(paymentDetailsEmpty));

      guard.canActivate()
        .subscribe((data) => {
          expect(data.toString()).toEqual('/checkout/payment-details');
          done();
        });
    });
  });

});
