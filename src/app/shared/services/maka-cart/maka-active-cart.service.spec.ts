import { async, TestBed } from '@angular/core/testing';
import {
  AUTH_FEATURE,
  AuthService,
  MULTI_CART_FEATURE,
  MultiCartService,
  OccEndpointsService,
  PROCESS_FEATURE,
  StateWithMultiCart,
} from '@spartacus/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MakaActiveCartService } from './maka-active-cart.service';
import { Store, StoreModule } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import * as CartMocks from './maka-cart.mock';

const baseUrl = 'test-base-url';
const cartId = 'c';
const userId = 'x';

class MockOccEndpointsService {
  getBaseEndpoint(): string {
    return '';
  }

  getEndpoint() {
  }
}

class MockHttpClient {}

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('');
  }
}

describe('MakaActiveCartService', () => {
  let makaActiveCartService: MakaActiveCartService;
  let store: Store<StateWithMultiCart>;
  let occEndpointsService: OccEndpointsService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(MULTI_CART_FEATURE, {}),
        StoreModule.forFeature(PROCESS_FEATURE, {}),
        StoreModule.forFeature(AUTH_FEATURE, {}),
      ],
      declarations: [],
      providers: [
        MakaActiveCartService,
        MockHttpClient,
        AuthService,
        MultiCartService,
        HttpClient,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        { provide: AuthService, useClass: MockAuthService }
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    makaActiveCartService = TestBed.inject(MakaActiveCartService);
    occEndpointsService = TestBed.inject(OccEndpointsService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  it('should create', () => {
    expect(makaActiveCartService).toBeTruthy();
  });

  describe('isCartRecurrenceConfigurationValid', () => {
    const openPay3DSMin = 6000.0;

    it('should return true for registered user\'s cart with recurrence configurations', () => {
      const isValidConfiguration = MakaActiveCartService
        .isCartRecurrenceConfigurationValid(CartMocks.MOCK_MAKA_CART_WITH_RECURRENCE, openPay3DSMin);
      expect(isValidConfiguration).toBeTrue();
    });

    it('should return false for guest user carts with recurrence configurations', () => {
      const isValidConfiguration = MakaActiveCartService
        .isCartRecurrenceConfigurationValid(CartMocks.MOCK_MAKA_CART_WITH_RECURRENCE_GUEST_USER, openPay3DSMin);
      expect(isValidConfiguration).toBeFalse();
    });

    it('should return false for anonymous user carts with recurrence configurations', () => {
      const isValidConfiguration = MakaActiveCartService
        .isCartRecurrenceConfigurationValid(CartMocks.MOCK_MAKA_CART_WITH_RECURRENCE_ANONYMOUS_USER, openPay3DSMin);
      expect(isValidConfiguration).toBeFalse();
    });

    it('should return false for carts with recurrenceConfiguration and totalPriceWithTax is mayor or equal than openPay3DSMin comming from /rest/v2/basesites', () => {
      const isValidConfiguration = MakaActiveCartService
        .isCartRecurrenceConfigurationValid(CartMocks.MOCK_MAKA_CART_WITH_RECURRENCE_AND_TOTAL_HIGHER_THAN_OPENPAYMINIMUM, openPay3DSMin);
      expect(isValidConfiguration).toBeFalse();
    });
    
  });

  describe('other methods', () => {
    it('should test createCartPaymentAddress', () => {
      spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
      makaActiveCartService.createCartPaymentAddress(cartId, userId, null).subscribe();
      const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/users/${userId}/carts/${cartId}/addresses/payment`);
      expect(mockReq.request.method).toEqual('POST');
      mockReq.flush('');
    });

    it('should test removeCartPaymentAddress', () => {
      spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
      makaActiveCartService.removeCartPaymentAddress(cartId, userId).subscribe();
      const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/users/${userId}/carts/${cartId}/addresses/payment`);
      expect(mockReq.request.method).toEqual('DELETE');
      mockReq.flush('');
    });

    it('should test addRecurrenceConfiguration', () => {
      spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
      const configId = 'testconfig';
      makaActiveCartService.addRecurrenceConfiguration(cartId, userId, configId).subscribe();
      const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/users/${userId}/carts/${cartId}/recurrent/${configId}`);
      expect(mockReq.request.method).toEqual('PUT');
      mockReq.flush('');
    });

    it('should test removeRecurrenceConfiguration', () => {
      spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
      makaActiveCartService.removeRecurrenceConfiguration(cartId, userId).subscribe();
      const mockReq = httpMock.expectOne((req) => !!req.url.match(`${cartId}/recurrent`));
      expect(mockReq.request.method).toEqual('DELETE');
      mockReq.flush('');
    });

    it('should test removeAssociateId', () => {
      spyOn(occEndpointsService, 'getEndpoint').and.returnValue(baseUrl);
      const associateId = 'assocId';
      makaActiveCartService.removeAssociateId(cartId, userId, associateId).subscribe();
      const mockReq = httpMock.expectOne((req) => !!req.url.match(`${cartId}/associates/${associateId}`));
      expect(mockReq.request.method).toEqual('DELETE');
      mockReq.flush('');
    });

    it('should test addAssociateId', () => {
      spyOn(occEndpointsService, 'getBaseEndpoint').and.returnValue(baseUrl);
      const associateId = 'assocId';
      makaActiveCartService.addAssociateId(cartId, userId, associateId).subscribe();
      const mockReq = httpMock.expectOne((req) => req.url === `${baseUrl}/users/${userId}/carts/${cartId}/associates/${associateId}`);
      expect(mockReq.request.method).toEqual('POST');
      mockReq.flush('');
    });
  });

});
