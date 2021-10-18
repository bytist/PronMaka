import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Address,
  DeliveryMode,
  I18nTestingModule,
  Order,
  PaymentDetails,
  TranslationService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { Card } from '@spartacus/storefront';

import { MakaCheckoutService } from '../../../../../core/checkout/facade/maka-checkout.service';
import {  MakaOrderOverviewComponent } from './maka-order-overview.component';
import createSpy = jasmine.createSpy;

@Component({ selector: 'app-cx-card', template: '' })
class MockCardComponent {
  @Input()
  content: Card;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();

  getOrderDetails(): Observable<Order> {
    return of({
      code: 'test-code-412',
      deliveryAddress: {
        country: {},
      },
      deliveryMode: {},
      paymentInfo: {
        billingAddress: {
          country: {},
        },
      },
    });
  }
}

class MockTranslationService {
  translate(): Observable<string> {
    return of();
  }
}

describe('MakaOrderOverviewComponent', () => {
  let component: MakaOrderOverviewComponent;
  let fixture: ComponentFixture<MakaOrderOverviewComponent>;
  let translationService: TranslationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [MakaOrderOverviewComponent, MockCardComponent],
      providers: [
        { provide: MakaCheckoutService, useClass: MockCheckoutService },
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderOverviewComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
  });

  it('should create', () => {
    component.order$ = of();
    component.displayTitle = true;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
