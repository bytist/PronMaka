import { async, TestBed } from '@angular/core/testing';
import {
  OccEndpointsService,
  OccConfig
} from '@spartacus/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MakaBaseSiteService } from './maka-base-site.service';

class MockOccEndpointsService {
  getBaseEndpoint(): string {
    return '';
  }
}

class MockOccConfig {
  backend = {
    occ: {
      baseUrl: 'test'
    }
  }
}

describe('MakaBaseSiteService', () => {
  let service: MakaBaseSiteService;
  let occEndpointsService: OccEndpointsService;
  let httpMock: HttpTestingController;
  let config: OccConfig;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        MakaBaseSiteService,
        OccConfig,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        { provide: OccConfig, useClass: MockOccConfig },
      ],
    }).compileComponents();

    occEndpointsService = TestBed.inject(OccEndpointsService);
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.inject(MakaBaseSiteService);
    config = TestBed.inject(OccConfig);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should test getActive', () => {
    service.getActive().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url.indexOf('/rest/v2/basesites?active=true&showExternalSites=true&fields=FULL') >= 0);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

  it('should test getEnvironment', () => {
    service.getEnvironment().subscribe();
    const mockReq = httpMock.expectOne((req) => req.url.indexOf('/rest/v2/basesites?active=true&showExternalSites=true&fields=FULL') >= 0);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush('');
  });

});
