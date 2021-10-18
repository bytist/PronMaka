import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ActiveCartService,
  Cart,
  I18nTestingModule,
  OrderEntry,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CartCouponModule } from '@spartacus/storefront';
import { MakaCartTotalsComponent } from './maka-cart-totals.component';

const cartMock: Cart = {
  name: 'cart-mock',
};

const entriesMock: OrderEntry[] = [
  {
    entryNumber: 1,
  },
  {
    entryNumber: 2,
  },
];

@Component({
  template: '',
  selector: 'app-maka-order-summary',
})
class MockOrderSummaryComponent {
  @Input()
  cart: Observable<Cart>;
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockActiveCartService {
  getActive(): Observable<Cart> {
    return of(cartMock);
  }
  getEntries(): Observable<OrderEntry[]> {
    return of(entriesMock);
  }
}

describe('CartTotalsComponent', () => {
  let component: MakaCartTotalsComponent;
  let fixture: ComponentFixture<MakaCartTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule, CartCouponModule],
      declarations: [
        MakaCartTotalsComponent,
        MockOrderSummaryComponent,
        MockUrlPipe,
      ],
      providers: [
        {
          provide: ActiveCartService,
          useClass: MockActiveCartService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCartTotalsComponent);
    component = fixture.componentInstance;
  });

  it('should get active cart on ngOnInit()', () => {
    let cart: Cart;

    component.ngOnInit();
    fixture.detectChanges();

    component.cart$.subscribe((data: Cart) => (cart = data));
    expect(cart).toEqual(cartMock);
  });

  it('should get entries on ngOnInit()', () => {
    let entries: OrderEntry[];

    component.ngOnInit();
    fixture.detectChanges();

    component.entries$.subscribe((data: OrderEntry[]) => (entries = data));
    expect(entries).toEqual(entriesMock);
  });
});
