import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { RouterState } from '@spartacus/core/src/routing/store/routing-state';
import { RoutingService } from '@spartacus/core';
import { Price } from '@spartacus/core/src/model/product.model';

import { MakaPartner } from '../../../../core/models/maka-user.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaCommissionDetailComponent } from './maka-commission-detail.component';
import { AssociateCommissionRecord, CommissionStatus } from '../../../../core/models/maka-associate-commission-record.model';
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
  currencyIso : 'MXN',
  formattedValue : '$10,000.00 MXN',
  value : 10000.0
};

const totalPriceNet: Price = {
  currencyIso : 'MXN',
  formattedValue : '$10,000.00 MXN',
  value : 10000.0
};

const commissionRecordStatus: CommissionStatus = {
  code: 'CREATED',
  name: 'Creado'
};

const commissionRecord: AssociateCommissionRecord = {
  code: 'testCode',
  activeClients: 15,
  status: commissionRecordStatus,
  totalOrders: 10,
  total: commissionTotal,
  ordersTotalPriceNet: totalPriceNet,
  commissionLevelApplied: '15%',
  dueDate: '10 Septiembre 2020',
  cutOffDate: '1 Agosto 2020',
};

class MockMakaAssociateService {
  getAssociatesCommissionRecord(code: string): Observable<AssociateCommissionRecord> {
    return of(commissionRecord);
  }

  getCurrentAssociate(): Observable<MakaPartner> {
    return of();
  }
}

class MockRoutingService {
   go = createSpy();

   getRouterState(): Observable<RouterState> {
    return of(routerState);
   }
}

describe('MakaCommissionDetailComponent', () => {
  let component: MakaCommissionDetailComponent;
  let fixture: ComponentFixture<MakaCommissionDetailComponent>;

  let mockMakaAssociateService: MakaAssociateService;
  let mockRoutingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
      ],
      declarations: [MakaCommissionDetailComponent],
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
    fixture = TestBed.createComponent(MakaCommissionDetailComponent);
    mockMakaAssociateService = TestBed.inject(MakaAssociateService);
    mockRoutingService = TestBed.inject(RoutingService);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    component.ngOnInit();

    component.commissionRecord$
      .pipe(take(1))
      .subscribe(commission => {
      expect(commission).toEqual(commissionRecord);
    });
  });
});
