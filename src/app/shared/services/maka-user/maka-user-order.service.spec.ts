import { async, TestBed } from '@angular/core/testing';
import {
  OccEndpointsService,
  ConverterService
} from '@spartacus/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MakaUserOrderService } from './maka-user-order.service';

class MockOccEndpointsService {
  getBaseEndpoint(): string {
    return '';
  }

  getUrl(): string {
    return '';
  }
}

describe('MakaUserOrderService', () => {
  let service: MakaUserOrderService;
  let occEndpointsService: OccEndpointsService;
  let httpMock: HttpTestingController;
  let converter: ConverterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        MakaUserOrderService,
        ConverterService,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
      ],
    }).compileComponents();

    occEndpointsService = TestBed.inject(OccEndpointsService);
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.inject(MakaUserOrderService);
    converter = TestBed.inject(ConverterService);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should test fetchOrderHistory', () => {
    spyOn(occEndpointsService, 'getUrl').and.returnValue('test-url');
    const page: any = 1;
    service.fetchOrderHistory('testid', {
      sortCode: 'test',
      currentPage: page,
      recurrentOrders: false
    }).subscribe();
    const mockReq = httpMock.expectOne((req) => req.method === 'GET');
    expect(mockReq.request.url).toEqual('test-url');
    mockReq.flush('');
  });

});
