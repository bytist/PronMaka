import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FeaturesConfig,
  FeaturesConfigModule,
  I18nTestingModule,
  Order,
  PromotionLocation,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';

import {
  PromotionService,
  Item,
  PromotionsModule
} from '@spartacus/storefront';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaOrderConfirmationItemsComponent } from './maka-order-confirmation-items.component';

import createSpy = jasmine.createSpy;

// tslint:disable-next-line:component-selector
@Component({ selector: 'cx-cart-item-list', template: '' })
class MockReviewSubmitComponent {
  @Input() items: Item[];
  @Input() readonly: boolean;
  @Input() promotionLocation: PromotionLocation = PromotionLocation.Checkout;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();

  getOrderDetails(): Observable<Order> {
    return of({
      entries: [
        {
          entryNumber: 1,
          quantity: 1,
        },
      ],
    });
  }
}

class MockPromotionService {
  getOrderPromotions(): void {}
  getOrderPromotionsFromCart(): void {}
  getOrderPromotionsFromCheckout(): void {}
  getOrderPromotionsFromOrder(): void {}
  getProductPromotionForEntry(): void {}
}

describe('OrderConfirmationItemsComponent', () => {
  let component: MakaOrderConfirmationItemsComponent;
  let fixture: ComponentFixture<MakaOrderConfirmationItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, PromotionsModule, FeaturesConfigModule],
      declarations: [
        MakaOrderConfirmationItemsComponent,
        MockReviewSubmitComponent,
      ],
      providers: [
        { provide: MakaCheckoutService, useClass: MockCheckoutService },
        { provide: PromotionService, useClass: MockPromotionService },
        {
          provide: FeaturesConfig,
          useValue: {
            features: { level: '1.3' },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderConfirmationItemsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should display items', () => {
    const items = () => fixture.debugElement.query(By.css('cx-cart-item-list'));
    component.ngOnInit();
    fixture.detectChanges();
    expect(items()).toBeTruthy();
  });
});
