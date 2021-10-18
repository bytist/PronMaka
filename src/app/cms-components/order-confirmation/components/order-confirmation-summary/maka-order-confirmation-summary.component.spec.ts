import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Cart, I18nTestingModule } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { OrderSummaryComponent, AppliedCouponsComponent, PromotionsComponent } from '@spartacus/storefront';

import createSpy = jasmine.createSpy;

import { MakaOrderConfirmationSummaryComponent } from './maka-order-confirmation-summary.component';
import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

describe('OrderConfirmationSummaryComponent', () => {
  let component: MakaOrderConfirmationSummaryComponent;
  let fixture: ComponentFixture<MakaOrderConfirmationSummaryComponent>;
  let mockActiveCartService: any;

  beforeEach(async(() => {
    mockActiveCartService = {
      getActive(): BehaviorSubject<Cart> {
        return new BehaviorSubject({
          totalItems: 5141,
          subTotal: { formattedValue: '11119' },
        });
      },
      loadDetails: createSpy(),
    };
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
      ],
      declarations: [
        MakaOrderConfirmationSummaryComponent,
        OrderSummaryComponent,
        PromotionsComponent,
        AppliedCouponsComponent,
      ],
      providers: [
        { provide: MakaCheckoutService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderConfirmationSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
