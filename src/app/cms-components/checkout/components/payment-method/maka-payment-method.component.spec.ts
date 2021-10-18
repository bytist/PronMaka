// import { Component, Input } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import {
//   ActiveCartService,
//   Address, AuthService,
//   CheckoutDeliveryService,
//   CheckoutPaymentService,
//   CheckoutService,
//   GlobalMessageService,
//   I18nTestingModule,
//   PaymentDetails,
//   RoutesConfig,
//   RoutingConfigService,
//   RoutingService,
//   UserPaymentService,
// } from '@spartacus/core';
// import { CardComponent, CheckoutConfigService, CheckoutStep, CheckoutStepType, ICON_TYPE } from '@spartacus/storefront';
//
// import { MakaPaymentMethodComponent } from './maka-payment-method.component';
// import { Observable, of } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { MakaPaymentMethodService } from './maka-payment-method.service';
// import createSpy = jasmine.createSpy;
//
//
// @Component({
//   selector: 'app-cx-icon',
//   template: '',
// })
// class MockCxIconComponent {
//   @Input() type: ICON_TYPE;
// }
//
// const mockPaymentDetails: PaymentDetails = {
//   id: 'mock payment id',
//   accountHolderName: 'Name',
//   cardNumber: '123456789',
//   cardType: {
//     code: 'Visa',
//     name: 'Visa',
//   },
//   expiryMonth: '01',
//   expiryYear: '2022',
//   cvn: '123',
// };
//
// const mockCheckoutStep: CheckoutStep = {
//   id: 'payment-method',
//   name: 'Payment method',
//   routeName: 'checkoutPaymentDetails',
//   type: [CheckoutStepType.PAYMENT_DETAILS],
// };
//
// const MockRoutesConfig: RoutesConfig = {
//   checkoutDeliveryMode: {paths: ['checkout/delivery-mode']},
//   checkoutPaymentDetails: {paths: ['checkout/payment-details']},
//   checkoutReviewOrder: {paths: ['checkout/review-order']},
// };
//
// class MockUserPaymentService {
//   loadPaymentMethods(): void {
//   }
//
//   getPaymentMethods(): Observable<PaymentDetails[]> {
//     return of();
//   }
//
//   getPaymentMethodsLoading(): Observable<boolean> {
//     return of();
//   }
// }
//
// class MockCheckoutService {
//   clearCheckoutStep = createSpy();
// }
//
// class MockCheckoutPaymentService {
//   setPaymentDetails = createSpy();
//   createPaymentDetails = createSpy();
//
//   getPaymentDetails(): Observable<PaymentDetails> {
//     return of(mockPaymentDetails);
//   }
// }
//
// class MockCheckoutDeliveryService {
//   getDeliveryAddress(): Observable<PaymentDetails> {
//     return of(null);
//   }
// }
//
// class MockRoutingService {
//   go = createSpy();
// }
//
// class MockCheckoutConfigService {
//   getCheckoutStep(): CheckoutStep {
//     return mockCheckoutStep;
//   }
//
//   getNextCheckoutStepUrl(): string {
//     return 'checkout/review-order';
//   }
//
//   getPreviousCheckoutStepUrl(): string {
//     return 'checkout/delivery-mode';
//   }
// }
//
// class MockGlobalMessageService {
//   add = createSpy();
// }
//
// class MockRoutingConfigService {
//   getRouteConfig(routeName: string) {
//     return MockRoutesConfig[routeName];
//   }
// }
//
// class MockActiveCartService {
//   isGuestCart(): boolean {
//     return false;
//   }
// }
//
// class MockMakaPaymentMethodService {
//   setPaymentDetails = createSpy();
// }
//
// class MockAuthService {
//   getOccUserId(): Observable<string> {
//     return of('userId12345');
//   }
// }
//
// const mockAddress: Address = {
//   id: 'mock address id',
//   firstName: 'John',
//   lastName: 'Doe',
//   titleCode: 'mr',
//   line1: 'Toyosaki 2 create on cart',
//   line2: 'line2',
//   town: 'town',
//   region: {isocode: 'JP-27'},
//   postalCode: 'zip',
//   country: {isocode: 'JP'},
// };
//
// @Component({
//   selector: 'app-cx-payment-form',
//   template: '',
// })
// class MockPaymentFormComponent {
//   @Input()
//   paymentMethodsCount: number;
//   @Input()
//   setAsDefaultField: boolean;
// }
//
// @Component({
//   selector: 'app-cx-spinner',
//   template: '',
// })
// class MockSpinnerComponent {
// }
//
// describe('MakaPaymentMethodComponent', () => {
//   let component: MakaPaymentMethodComponent;
//   let fixture: ComponentFixture<MakaPaymentMethodComponent>;
//   let mockUserPaymentService: UserPaymentService;
//   let mockCheckoutPaymentService: CheckoutPaymentService;
//   let mockRoutingService: RoutingService;
//   let mockActiveCartService: ActiveCartService;
//   let mockGlobalMessageService: GlobalMessageService;
//   let mockCheckoutService: CheckoutService;
//
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [I18nTestingModule, HttpClientTestingModule],
//       declarations: [
//         MakaPaymentMethodComponent,
//         MockPaymentFormComponent,
//         CardComponent,
//         MockSpinnerComponent,
//         MockCxIconComponent,
//       ],
//       providers: [
//         {provide: UserPaymentService, useClass: MockUserPaymentService},
//         {provide: CheckoutService, useClass: MockCheckoutService},
//         {
//           provide: CheckoutDeliveryService,
//           useClass: MockCheckoutDeliveryService,
//         },
//         {
//           provide: ActiveCartService,
//           useClass: MockActiveCartService,
//         },
//         {
//           provide: CheckoutPaymentService,
//           useClass: MockCheckoutPaymentService,
//         },
//         {provide: GlobalMessageService, useClass: MockGlobalMessageService},
//         {provide: RoutingService, useClass: MockRoutingService},
//         {provide: CheckoutConfigService, useClass: MockCheckoutConfigService},
//         {provide: ActivatedRoute, useValue: {}},
//         {provide: RoutingConfigService, useClass: MockRoutingConfigService},
//         {provide: MakaPaymentMethodService, useClass: MockMakaPaymentMethodService},
//         {provide: AuthService, useClass: MockAuthService},
//       ],
//     }).compileComponents();
//
//     mockUserPaymentService = TestBed.inject(UserPaymentService);
//     mockCheckoutPaymentService = TestBed.inject(CheckoutPaymentService);
//     mockRoutingService = TestBed.inject(RoutingService);
//     mockActiveCartService = TestBed.inject(ActiveCartService);
//     mockGlobalMessageService = TestBed.inject(GlobalMessageService);
//     mockCheckoutService = TestBed.inject(CheckoutService);
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(MakaPaymentMethodComponent);
//     component = fixture.componentInstance;
//   });
//
//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should set payment details', () => {
//     const paymentDetails = {
//       paymentDetails: mockPaymentDetails
//     };
//     component.setPaymentDetails(paymentDetails);
//     expect(mockCheckoutPaymentService.createPaymentDetails).toHaveBeenCalled();
//   });
//
// });
