import { async, TestBed } from '@angular/core/testing';
import {
  AuthService,
  OccEndpointsService,
} from '@spartacus/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';

import { MakaAssociateService } from './maka-associate.service';
import { MakaPartner } from '../../../core/models/maka-user.model';

class MockOccEndpointsService {
  getBaseEndpoint(): string {
    return '';
  }
}

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('');
  }
}

const userId = 'x';
const baseUrl = 'test-base-url';
const partner: MakaPartner = {
  customerId: 'test',
  displayUid: 'test'
};

describe('MakaAssociateService', () => {
  let service: MakaAssociateService;
  let occEndpointsService: OccEndpointsService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        MakaAssociateService,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        { provide: AuthService, useClass: MockAuthService }
      ],
    }).compileComponents();

    occEndpointsService = TestBed.inject(OccEndpointsService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.inject(MakaAssociateService);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should test getAssociateEndpointUrl', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    service.getAssociateEndpointUrl();
    expect(occEndpointsService.getBaseEndpoint).toHaveBeenCalled();
  });

  it('should test getCurrentAssociate', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    service.getCurrentAssociate().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}?fields=FULL`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test sendCustomerInvitation', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    service.sendCustomerInvitation({ email: 'test@test.com' }).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/invitation`);
    expect(mockReq.request.method).toEqual('POST');
    mockReq.flush('');
  });

  it('should test getLastPayableCommissionRecordForCurrentAssociate', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    service.getLastPayableCommissionRecordForCurrentAssociate().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/commissions/current`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test getAssociateCommissionRecordsHistory', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    const year = '2020';
    const page: any = 1;
    service.getAssociateCommissionRecordsHistory(year, page).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/commissions`);
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.params.get('year')).toEqual(year);
    expect(mockReq.request.params.get('currentPage')).toEqual(page);
    mockReq.flush('');
  });

  it('should test getAssociatesCommissionRecord', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    const code = 'code';
    service.getAssociatesCommissionRecord(code).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/commissions/${code}`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test getAssociatesCommissionRecordOrders', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    const code = '20202';
    const page: any = 1;
    service.getAssociatesCommissionRecordOrders(code, page).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/commissions/${code}/orders`);
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.params.get('currentPage')).toEqual(page);
    mockReq.flush('');
  });

  it('should test register', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    service.register(partner).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates`);
    expect(mockReq.request.method).toEqual('POST');
    mockReq.flush('');
  });

  it('should test search', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    const associateId = '0000020202';
    service.search(associateId).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/search?code=${associateId}`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test forecastAssociateCommission', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    service.forecastAssociateCommission().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/dashboard/commission/info`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test searchDashboardAssociateReferralOrders', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    const page: any = 1;
    service.searchDashboardAssociateReferralOrders(page).subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/dashboard/commission/orders`);
    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.params.get('currentPage')).toEqual(page);
    mockReq.flush('');
  });

  it('should test getDashboardStats()', () => {
    spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
    spyOn(authService, 'getOccUserId').and.returnValue(of(userId));
    service.getDashboardStats().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/associates/${userId}/statistics`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

});
