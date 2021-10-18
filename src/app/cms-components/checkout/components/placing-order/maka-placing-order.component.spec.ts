import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  Observable,
  of
} from 'rxjs';
import {
  Order,
  I18nTestingModule,
  RoutingService
} from '@spartacus/core';
import {
  Pipe,
  PipeTransform
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPlacingOrderComponent } from './maka-placing-order.component';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';
import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

class MockMakaCheckoutService {
  placeOrder(): void {}
  placeOrder3ds(userId: string, cartId: string): void {}
  getOrderDetails(): Observable<Order> {
    return of({});
  }
}

class MockMakaActiveCartService {
  getCartParamsRequest(unsubscribe): Observable<[string, string]> {
    return of(['userId', 'cartId']);
  }
}

const routingServiceStub = {
  go(): void {},
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {}
}

describe('MakaPlacingOrderComponent', () => {
  let component: MakaPlacingOrderComponent;
  let fixture: ComponentFixture<MakaPlacingOrderComponent>;
  let mockMakaActiveCartService: MockMakaActiveCartService;
  let mockMakaCheckoutService: MockMakaCheckoutService;

  beforeEach(async(() => {
    mockMakaActiveCartService =  new MockMakaActiveCartService();
    mockMakaCheckoutService =  new MockMakaCheckoutService();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule
      ],
      declarations: [ MockUrlPipe, MakaPlacingOrderComponent ],
      providers: [
        { provide: MakaCheckoutService, useValue: mockMakaCheckoutService },
        { provide: RoutingService, useValue: routingServiceStub },
        { provide: MakaActiveCartService, useValue: mockMakaActiveCartService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPlacingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    spyOn(mockMakaCheckoutService, 'placeOrder3ds').and.stub();

    component.ngOnInit();

    expect(mockMakaCheckoutService.placeOrder3ds).toHaveBeenCalledWith('userId', 'cartId');
  });
});
