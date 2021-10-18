import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Cart,
  I18nTestingModule,
  Order,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { MakaOrderConfirmationTotalsComponent } from './maka-order-confirmation-totals.component';
import createSpy = jasmine.createSpy;
import { By } from '@angular/platform-browser';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

@Component({ selector: 'app-maka-order-confirmation-totals', template: '' })
class MockOrderSummaryComponent {
  @Input()
  cart: Cart;
}

class MockCheckoutService {
  clearCheckoutData = createSpy();

  getOrderDetails(): Observable<Order> {
    return of({
      code: 'test-code-412',
    });
  }
}

describe('OrderConfirmationComponent', () => {
  let component: MakaOrderConfirmationTotalsComponent;
  let fixture: ComponentFixture<MakaOrderConfirmationTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        MakaOrderConfirmationTotalsComponent,
        MockOrderSummaryComponent,
      ],
      providers: [{ provide: MakaCheckoutService, useClass: MockCheckoutService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderConfirmationTotalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app-maka-order-confirmation-summary', () => {
    const getOrderSummary = () => fixture.debugElement.query(By.css('app-maka-order-confirmation-summary'));
    fixture.detectChanges();
    expect(getOrderSummary()).toBeTruthy();
  });
});
