import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import { FormErrorsModule, ICON_TYPE } from '@spartacus/storefront';
import {
  Address,
  AddressValidation, AuthService,
  CardType,
  CheckoutPaymentService,
  Country, GlobalMessageService,
  I18nTestingModule,
  Region,
  UserAddressService,
} from '@spartacus/core';

import { MakaPaymentFormComponent } from './maka-payment-form.component';
import { MakaCart } from '../../../../../core/models/maka-cart.model';
import { MakaAddress } from '../../../../../core/models';
import { MakaActiveCartService } from '../../../../../shared/services/maka-cart/maka-active-cart.service';
import createSpy = jasmine.createSpy;
import { MakaPaymentMethodService } from '../../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { MakaEnvironmentService } from '../../../../../shared/services/maka-environment/maka-environment.service';

@Component({
  selector: 'app-cx-spinner',
  template: '',
})
class MockSpinnerComponent {}

const mockMakaAddress: MakaAddress = {
  streetName: 'streetName',
  streetNumber: 'streetNumber',
  appartement: 'appartement',
  district: 'district',
  town: 'town',
  region: {
    isocode: 'isocode'
  },
  postalCode: 'postalCode',
  country: {
    isocode: 'isocode'
  }
};

const mockMakaCart: MakaCart = {
  paymentAddress: mockMakaAddress,
  deliveryAddress: mockMakaAddress
};

@Component({
  selector: 'app-cx-billing-address-form',
  template: '',
})
class MockBillingAddressFormComponent {
  @Input()
  billingAddress: Address;
  @Input()
  countries$: Observable<Country[]>;
}

@Component({
  selector: 'app-cx-card',
  template: '',
})
class MockCardComponent {
  @Input()
  content: any;
}

@Component({
  selector: 'app-cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

class MockCheckoutPaymentService {
  loadSupportedCardTypes = createSpy();
  getCardTypes(): Observable<CardType[]> {
    return of();
  }

  getSetPaymentDetailsResultProcess() {
    return of({ loading: false });
  }
}

class MockMakaActiveCartService {
  getActiveCartId(): Observable<string> {
    return of('10001');
  }

  getActive(): Observable<MakaCart> {
    return of(mockMakaCart);
  }

  removeCartPaymentAddress(cartId: string, userId: string): Observable<any> {
    return of({});
  }

  createCartPaymentAddress(cartId: string, userId: string, paymentAddress: MakaAddress): Observable<MakaAddress> {
    return of(mockMakaAddress);
  }
}

class MockAuthService {
  getOccUserId(): Observable<string> {
    return of('1');
  }
}

const mockSuggestedAddressModalRef: any = {
  componentInstance: {
    enteredAddress: '',
    suggestedAddresses: '',
  },
  result: new Promise((resolve) => {
    return resolve(true);
  }),
};

class MockModalService {
  open(): any {
    return mockSuggestedAddressModalRef;
  }
}

class MockUserAddressService {
  getRegions(): Observable<Region[]> {
    return of([]);
  }
}

class MockMakaPaymentMethodService {
  isGoNextTriggered$ = of(true);
  setIsCCFormValid(isValid: boolean) {}
}

class MockMakaEnvironmentService {
  getEnvironmentConfig(): Observable<any> {
    return of({
      openpayConfig: {
        sandboxMode: true,
        apiKey: 'test12345',
        merchantId: 'test54321'
      }
    });
  }
}

class MockGlobalMessageService {
  add() {}
  remove() {}
}

const mockAddressValidation: AddressValidation = {
  decision: 'test address validation',
  suggestedAddresses: [{ id: 'address1' }],
};

describe('MakaPaymentFormComponent', () => {
  let component: MakaPaymentFormComponent;
  let fixture: ComponentFixture<MakaPaymentFormComponent>;
  let mockCheckoutPaymentService: MockCheckoutPaymentService;
  let mockUserAddressService: MockUserAddressService;
  let mockMakaActiveCartService: MockMakaActiveCartService;
  let mockAuthService: MockAuthService;
  let mockMakaPaymentMethodService: MockMakaPaymentMethodService;
  let mockMakaEnvironmentService: MockMakaEnvironmentService;

  beforeEach(async(() => {
    mockCheckoutPaymentService = new MockCheckoutPaymentService();
    mockUserAddressService = new MockUserAddressService();
    mockMakaActiveCartService = new MockMakaActiveCartService();
    mockAuthService = new MockAuthService();
    mockMakaPaymentMethodService = new MockMakaPaymentMethodService();
    mockMakaEnvironmentService = new MockMakaEnvironmentService();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgSelectModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [
        MakaPaymentFormComponent,
        MockCardComponent,
        MockBillingAddressFormComponent,
        MockCxIconComponent,
        MockSpinnerComponent,
      ],
      providers: [
        {
          provide: MakaActiveCartService,
          useValue: mockMakaActiveCartService,
        },
        { provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: UserAddressService,
          useValue: mockUserAddressService,
        },
        {
          provide: CheckoutPaymentService,
          useValue: mockCheckoutPaymentService,
        },
        {
          provide: MakaPaymentMethodService,
          useValue: mockMakaPaymentMethodService,
        },
        {
          provide: MakaEnvironmentService,
          useValue: mockMakaEnvironmentService,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(MakaPaymentFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPaymentFormComponent);
    component = fixture.componentInstance;
    spyOn(component.closeForm, 'emit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
