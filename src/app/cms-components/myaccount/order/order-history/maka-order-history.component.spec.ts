import {
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthService,
  I18nTestingModule,
  OrderHistoryList,
  RoutingService,
  UserOrderService,
} from '@spartacus/core';
import {
  BehaviorSubject,
  Observable,
  of
} from 'rxjs';

import { MakaUserOrderService } from 'src/app/shared/services/maka-user/maka-user-order.service';
import { MakaOrderHistoryComponent } from './maka-order-history.component';
import { MakaOrderHistorySearch } from '../../../../core/models/maka-order.model';

@Pipe({
  name: 'getPetName',
})
class MockGetPetNameFromOrderPipe implements PipeTransform {
  transform() {}
}

const mockOrders: OrderHistoryList = {
  orders: [
    {
      code: '1',
      placed: new Date('2018-01-01'),
      statusDisplay: 'test',
      total: { formattedValue: '1' },
    },
    {
      code: '2',
      placed: new Date('2018-01-02'),
      statusDisplay: 'test2',
      total: { formattedValue: '2' },
    },
  ],
  pagination: { totalResults: 1, sort: 'byDate' },
  sorts: [{ code: 'byDate', selected: true }],
};

@Component({
  template: '',
  selector: 'app-cx-pagination',
})
class MockPaginationComponent {
  @Input() pagination;
  @Output() viewPageEvent = new EventEmitter<string>();
}
@Component({
  template: '',
  selector: 'app-cx-sorting',
})
class MockSortingComponent {
  @Input() sortOptions;
  @Input() sortLabels;
  @Input() selectedOption;
  @Input() placeholder;
  @Output() sortListEvent = new EventEmitter<string>();
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockUserOrderService {
  orderHistroy = new BehaviorSubject(mockOrders);

  getOrderHistoryList(): Observable<OrderHistoryList> {
    return this.orderHistroy;
  }
  getOrderHistoryListLoaded(): Observable<boolean> {
    return of(true);
  }
  loadOrderList(
    userId: string,
    pageSize: number,
    currentPage?: number,
    sort?: string
  ): void {}
  clearOrderList() {}
}

class MockRoutingService {
  go() {}
}

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('userId12345');
  }
}

class MockMakaUserOrderService {
  fetchOrderHistory(
    userId: string,
    event: MakaOrderHistorySearch
): Observable<OrderHistoryList> {
    return of(mockOrders);
  }
}

describe('MakaOrderHistoryComponent', () => {
  let component: MakaOrderHistoryComponent;
  let fixture: ComponentFixture<MakaOrderHistoryComponent>;
  let userService: UserOrderService | MockUserOrderService;
  let routingService: RoutingService;
  let makaUserOrderService: MakaUserOrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        MakaOrderHistoryComponent,
        MockUrlPipe,
        MockPaginationComponent,
        MockSortingComponent,
        MockGetPetNameFromOrderPipe
      ],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: UserOrderService, useClass: MockUserOrderService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MakaUserOrderService, useClass: MockMakaUserOrderService }
      ],
    }).compileComponents();

    userService = TestBed.inject(UserOrderService);
    routingService = TestBed.inject(RoutingService);
    makaUserOrderService = TestBed.inject(MakaUserOrderService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read order list', () => {
    let orders: OrderHistoryList;
    component.orders$
      .subscribe((value) => {
        orders = value;
      })
      .unsubscribe();
    expect(orders).toEqual(mockOrders);
  });

  it('should display No orders found page if no orders are found', () => {
    const emptyOrderList: OrderHistoryList = {
      orders: [],
      pagination: { totalResults: 0, sort: 'byDate' },
      sorts: [{ code: 'byDate', selected: true }],
    };

    (userService as MockUserOrderService).orderHistroy.next(emptyOrderList);
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.cx-order-history-no-order'))
    ).not.toBeNull();
  });

  it('should set correctly sort code', () => {
    spyOn(makaUserOrderService, 'fetchOrderHistory').and.callThrough();

    component.changeSortCode('byOrderNumber');

    expect(component.sortType).toBe('byOrderNumber');

    const event: MakaOrderHistorySearch = {
      sortCode: 'byOrderNumber',
      currentPage: 0,
      recurrentOrders: false
    };

    component.orders$.subscribe(orders => {
      expect(orders).toEqual(mockOrders);
      expect(makaUserOrderService.fetchOrderHistory).toHaveBeenCalledWith('userId12345', event);
    });
  });

  it('should set correctly page', () => {
    spyOn(makaUserOrderService, 'fetchOrderHistory').and.callThrough();

    component.sortType = 'byDate';
    component.pageChange(1);

    const event: MakaOrderHistorySearch = {
      sortCode: 'byDate',
      currentPage: 1,
      recurrentOrders: false
    };
    component.orders$.subscribe(orders => {
      expect(orders).toEqual(mockOrders);
      expect(makaUserOrderService.fetchOrderHistory).toHaveBeenCalledWith('userId12345', event);
    });
  });

  it('should clear order history data when component destroy', () => {
    spyOn(userService, 'clearOrderList').and.stub();

    component.ngOnDestroy();
    expect(userService.clearOrderList).toHaveBeenCalledWith();
  });
});
