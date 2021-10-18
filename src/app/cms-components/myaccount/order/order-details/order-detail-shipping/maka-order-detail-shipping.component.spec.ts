import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule, Order } from '@spartacus/core';
import { of } from 'rxjs';
import { CardModule, OrderDetailsService } from '@spartacus/storefront';

import { MakaOrderDetailShippingComponent } from './maka-order-detail-shipping.component';

const mockOrder = {
  code: '1',
  statusDisplay: 'Shipped',
  deliveryAddress: {
    firstName: 'John',
    lastName: 'Smith',
    region: {
      name: 'Montevideo'
    },
    appartment: '102',
    line1: 'Buckingham Street 5',
    line2: '1A',
    phone: '(+11) 111 111 111',
    postalCode: 'MA8902',
    town: 'London',
    country: {
      isocode: 'UK',
    },
  },
  deliveryMode: {
    name: 'Standard order-detail-shipping',
    description: '3-5 days',
  },
  paymentInfo: {
    accountHolderName: 'John Smith',
    cardNumber: '************6206',
    expiryMonth: '12',
    expiryYear: '2026',
    cardType: {
      name: 'Visa',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      line1: 'Buckingham Street 5',
      line2: '1A',
      phone: '(+11) 111 111 111',
      postalCode: 'MA8902',
      town: 'London',
      country: {
        isocode: 'UK',
      },
    },
  },
  created: new Date('2019-02-11T13:02:58+0000'),
  consignments: [
    {
      code: 'a00000341',
      status: 'SHIPPED',
      statusDate: new Date('2019-02-11T13:05:12+0000'),
      entries: [{ orderEntry: {}, quantity: 1, shippedQuantity: 1 }],
    },
  ],
};

class MockOrderDetailsService {
  getOrderDetails() {
    return of(mockOrder);
  }
}

describe('MakaOrderDetailShippingComponent', () => {
  let component: MakaOrderDetailShippingComponent;
  let fixture: ComponentFixture<MakaOrderDetailShippingComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CardModule, I18nTestingModule],
      providers: [
        { provide: OrderDetailsService, useClass: MockOrderDetailsService },
      ],
      declarations: [MakaOrderDetailShippingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderDetailShippingComponent);
    el = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.order$ = of();
    expect(component).toBeTruthy();
  });
});
