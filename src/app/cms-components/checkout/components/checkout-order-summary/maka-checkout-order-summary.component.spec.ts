import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActiveCartService,
  Cart,
  CartVoucherService,
  CmsService,
  I18nTestingModule,
  Page, PageType,
} from '@spartacus/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OrderSummaryComponent, AppliedCouponsComponent, ICON_TYPE, PromotionsComponent } from '@spartacus/storefront';
import { MakaCheckoutOrderSummaryComponent } from './maka-checkout-order-summary.component';
import { MakaPlaceOrderComponent } from '../place-order/maka-place-order.component';
import createSpy = jasmine.createSpy;

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

const personalizationContext = {
  actions: [
    {
      customization_name: btoa('customization_name1'),
      customization_code: btoa('customization_code1'),
      variation_name: btoa('variation_name1'),
      variation_code: btoa('variation_code1'),
      action_name: btoa('action_name1'),
      action_type: btoa('action_type1'),
    },
    {
      customization_name: btoa('customization_name2'),
      customization_code: btoa('customization_code2'),
      variation_name: btoa('variation_name2'),
      variation_code: btoa('variation_code2'),
      action_name: btoa('action_name2'),
      action_type: btoa('action_type2'),
    },
  ],
  segments: [btoa('segment1'), btoa('segment2')],
};

const personalizationContextBase64 = btoa(
  JSON.stringify(personalizationContext)
);

const mockContentPage: Page = {
  type: PageType.CONTENT_PAGE,
  template: 'CartPageTemplate',
  title: 'Shopping Cart',
  slots: {
    PlaceholderContentSlot: {
      components: [
        {
          uid: 'PersonalizationScriptComponent',
          properties: {
            script: {
              data: personalizationContextBase64,
            },
          },
        },
      ],
    },
  },
};

class MockCmsService {
  getCurrentPage(): Observable<Page> {
    return of(mockContentPage);
  }
}

describe('CheckoutOrderSummaryComponent', () => {
  let component: MakaCheckoutOrderSummaryComponent;
  let fixture: ComponentFixture<MakaCheckoutOrderSummaryComponent>;
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
      imports: [I18nTestingModule],
      declarations: [
        MakaCheckoutOrderSummaryComponent,
        OrderSummaryComponent,
        PromotionsComponent,
        AppliedCouponsComponent,
        MockCxIconComponent,
        MakaPlaceOrderComponent
      ],
      providers: [
        { provide: ActiveCartService, useValue: mockActiveCartService },
        { provide: CartVoucherService, useValue: {} },
        { provide: CmsService, useClass: MockCmsService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCheckoutOrderSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
