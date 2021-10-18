import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { RouterState } from '@spartacus/core/src/routing/store/routing-state';
import { PaginationModel } from '@spartacus/core/src/model/misc.model';
import { I18nTestingModule, Price, RoutingService } from '@spartacus/core';

import { MakaCommissionDetailOrdersComponent } from './maka-commission-detail-orders.component';
import { MakaAssociateService } from '../../../../../shared/services/maka-associate/maka-associate.service';
import {
  AssociateDashboardCommissionOrder,
  AssociateDashboardCommissionOrders
} from '../../../../../core/models/maka-associate-dashboard-commission-orders.model';
import createSpy = jasmine.createSpy;

const routerState: RouterState = {
  navigationId: 1,
  state: {
    url: '',
    queryParams: {},
    params: {
      code: 'testCode'
    },
    cmsRequired: false,
    context: {
      id: ''
    }
  },
};

const paginationData: PaginationModel = {
  currentPage: 0,
  pageSize: 5,
  totalPages: 2,
  totalResults: 9
};

const totalPrice: Price = {
  currencyIso: 'MXN',
  formattedValue: '$10,000.00 MXN',
  value: 10000.0
};

const order: AssociateDashboardCommissionOrder = {
  code: 'C0001',
  date: new Date(),
  user: {},
  total: totalPrice
};

const commissionOrders: AssociateDashboardCommissionOrders = {
  orders: [order],
  pagination: paginationData
};

class MockMakaAssociateService {
  getAssociatesCommissionRecordOrders(code: string, currentPage: number): Observable<AssociateDashboardCommissionOrders> {
    return of(commissionOrders);
  }
}

class MockRoutingService {
  go = createSpy();

  getRouterState(): Observable<RouterState> {
    return of(routerState);
  }
}

describe('MakaCommissionDetailOrdersComponent', () => {
  let component: MakaCommissionDetailOrdersComponent;
  let fixture: ComponentFixture<MakaCommissionDetailOrdersComponent>;

  let mockMakaAssociateService: MakaAssociateService;
  let mockRoutingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        I18nTestingModule
      ],
      declarations: [MakaCommissionDetailOrdersComponent],
      providers: [
        {
          provide: MakaAssociateService,
          useClass: MockMakaAssociateService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCommissionDetailOrdersComponent);
    mockMakaAssociateService = TestBed.inject(MakaAssociateService);
    mockRoutingService = TestBed.inject(RoutingService);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    spyOn(mockMakaAssociateService, 'getAssociatesCommissionRecordOrders').and.callThrough();

    component.ngOnInit();
    component.commissionOrdersPage$.subscribe(ordersPage => {
      expect(commissionOrders).toEqual(ordersPage);
    });

    expect(mockMakaAssociateService.getAssociatesCommissionRecordOrders).toHaveBeenCalledWith('testCode', 0);
  });

  it('should change page', () => {
    component.pageChange(0);

    expect(component.nextPage$.value).toEqual(0);
  });
});
