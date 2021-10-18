import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalMessageService } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import {HttpEvent} from "@angular/common/http";

import { MakaCommissionPaymentComponent } from './maka-commission-payment.component';
import { Price} from '@spartacus/core/src/model/product.model';
import { MakaPartner } from '../../../../core/models/maka-user.model';
import { CustomerInvitation } from '../../../../core/models/maka-customer-invitation.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { AssociateCommissionRecord, CommissionStatus } from '../../../../core/models/maka-associate-commission-record.model';
import { MakaCfdiUploadService } from '../../../../shared/services/maka-common/cfdi-upload-service';

import createSpy = jasmine.createSpy;


const totalPrice: Price = {
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
  code: 'S101',
  activeClients: 15,
  status: commissionRecordStatus,
  totalOrders: 10,
  total: totalPrice,
  ordersTotalPriceNet: totalPriceNet,
  commissionLevelApplied: '15%',
  dueDate: '10 Septiembre 2020',
  cutOffDate: '1 Agosto 2020',
};

class MockGlobalMessageService {
  add = createSpy();
  remove = createSpy();

  get() {
    return of();
  }
}

class MockMakaAssociateService {
  getCurrentAssociate(): Observable<MakaPartner> {
    return of();
  }

  getLastPayableCommissionRecordForCurrentAssociate(): Observable<AssociateCommissionRecord> {
    return of(commissionRecord);
  }

  sendCustomerInvitation(customerInvitation: CustomerInvitation): Observable<any> {
    return of();
  }
}

class MockMakaCfdiUploadService {
  public uploadFile(file: File): Observable<HttpEvent<any>> {
    return of();
  }
}

describe('MakaCommissionPaymentComponent', () => {
  let component: MakaCommissionPaymentComponent;
  let fixture: ComponentFixture<MakaCommissionPaymentComponent>;

  let mockGlobalMessageService: GlobalMessageService;
  let mockMakaAssociateService: MakaAssociateService;
  let mockCfdiUploadService: MakaCfdiUploadService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
      ],
      declarations: [MakaCommissionPaymentComponent],
      providers: [
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: MakaAssociateService,
          useClass: MockMakaAssociateService,
        },
        {
          provide: MakaCfdiUploadService,
          useClass: MockMakaCfdiUploadService
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCommissionPaymentComponent);
    mockMakaAssociateService = TestBed.inject(MakaAssociateService);
    mockGlobalMessageService = TestBed.inject(GlobalMessageService);
    mockCfdiUploadService = TestBed.inject(MakaCfdiUploadService);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
