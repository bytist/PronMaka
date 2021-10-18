import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Price } from '@spartacus/core/src/model/product.model';
import { PaginationModel } from '@spartacus/core/src/model/misc.model';
import { RouterState } from '@spartacus/core/src/routing/store/routing-state';
import { RoutingService, I18nTestingModule } from '@spartacus/core';

import { MakaPartner } from '../../../../core/models/maka-user.model';
import { CustomerInvitation } from '../../../../core/models/maka-customer-invitation.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { AssociateCommissionRecord, CommissionStatus } from '../../../../core/models/maka-associate-commission-record.model';
import { MakaCommissionHistoryComponent } from './maka-commission-history.component';
import { AssociateCommissionRecordHistoryPage } from '../../../../core/models/maka-associate-commission-record-history.model';
import { Filter } from '../../../../core/models/maka-filters.model';
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

const commissionTotal: Price = {
  currencyIso: 'MXN',
  formattedValue: '$10,000.00 MXN',
  value: 10000.0
};

const totalPriceNet: Price = {
  currencyIso: 'MXN',
  formattedValue: '$10,000.00 MXN',
  value: 10000.0
};

const commissionRecordStatus: CommissionStatus = {
  code: 'CREATED',
  name: 'Creado'
};

const paginationData: PaginationModel = {
  currentPage: 0,
  pageSize: 5,
  totalPages: 2,
  totalResults: 9
};

const commissionRecord: AssociateCommissionRecord = {
  code: 'S101',
  activeClients: 15,
  status: commissionRecordStatus,
  totalOrders: 10,
  total: commissionTotal,
  ordersTotalPriceNet: totalPriceNet,
  commissionLevelApplied: '15%',
  dueDate: '10 Septiembre 2020',
  cutOffDate: '1 Agosto 2020',
};

const filter: Filter = {
  key: 'years',
  value: ['2019', '2020'],
};

const commissionRecordHistoryPage: AssociateCommissionRecordHistoryPage = {
  records: [commissionRecord],
  filters: [filter],
  pagination: paginationData
};

class MockMakaAssociateService {
  getCurrentAssociate(): Observable<MakaPartner> {
    return of();
  }

  getAssociateCommissionRecordsHistory(): Observable<AssociateCommissionRecordHistoryPage> {
    return of(commissionRecordHistoryPage);
  }

  sendCustomerInvitation(customerInvitation: CustomerInvitation): Observable<any> {
    return of();
  }
}

class MockRoutingService {
  go = createSpy();

  getRouterState(): Observable<RouterState> {
    return of(routerState);
  }
}

describe('MakaCommissionHistoryComponent', () => {
  let component: MakaCommissionHistoryComponent;
  let fixture: ComponentFixture<MakaCommissionHistoryComponent>;

  let mockMakaAssociateService: MakaAssociateService;
  let mockRoutingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        I18nTestingModule
      ],
      declarations: [MakaCommissionHistoryComponent],
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
    fixture = TestBed.createComponent(MakaCommissionHistoryComponent);
    mockMakaAssociateService = TestBed.inject(MakaAssociateService);
    mockRoutingService = TestBed.inject(RoutingService);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change page', () => {
    component.pageChange(0);
    expect(component.getData$.value.nextPage).toEqual(0);
  });

  it('should get years filter', () => {
    const years = component.getYearsFilter([filter]);
    expect(years).toEqual([{ year: '2019', label: '2019' }, { year: '2020', label: '2020' }]);
  });

  it('should change year', () => {
    component.changeYear({ year: '2020', label: '2020' });
    expect(component.getData$.value.nextPage).toEqual(0);
    expect(component.getData$.value.year).toEqual('2020');
  });

  it('should go to commission details page', () => {
    component.goToCommissionRecordDetail(commissionRecord);
    expect(mockRoutingService.go).toHaveBeenCalled();
  });
});
