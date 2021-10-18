import { async, TestBed } from '@angular/core/testing';
import { GlobalMessageService, OccEndpointsService } from '@spartacus/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ICON_TYPE } from '@spartacus/storefront';

import { MakaPaymentMethodService } from './maka-payment-method.service';
import createSpy = jasmine.createSpy;

class MockOccEndpointsService {
  getBaseEndpoint(): string {
    return '';
  }
}

describe('MakaPaymentMethodService', () => {
  let makaPaymentMethodService: MakaPaymentMethodService;
  let mockGlobalMessageService: any;


  beforeEach(async(() => {
    mockGlobalMessageService = {
      add: createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        { provide: GlobalMessageService, useValue: mockGlobalMessageService },
      ],
    }).compileComponents();

    makaPaymentMethodService = TestBed.inject(MakaPaymentMethodService);
  }));

  it('should create', () => {
    expect(makaPaymentMethodService).toBeTruthy();
  });

  it('should return the proper icon based on given code', () => {
    expect(makaPaymentMethodService.getCardIconForCode('visa')).toBe(ICON_TYPE.VISA);
    expect(makaPaymentMethodService.getCardIconForCode('mastercard')).toBe(ICON_TYPE.MASTER_CARD);
    expect(makaPaymentMethodService.getCardIconForCode('mastercard_eurocard')).toBe(
      ICON_TYPE.MASTER_CARD
    );
    expect(makaPaymentMethodService.getCardIconForCode('diners')).toBe(ICON_TYPE.DINERS_CLUB);
    expect(makaPaymentMethodService.getCardIconForCode('amex')).toBe(ICON_TYPE.AMEX);
    expect(makaPaymentMethodService.getCardIconForCode('american_express')).toBe(ICON_TYPE.AMEX);
    expect(makaPaymentMethodService.getCardIconForCode('otherCardType')).toBe(ICON_TYPE.CREDIT_CARD);
  });
});
