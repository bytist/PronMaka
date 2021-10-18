import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  ActiveCartService,
  Address, Cart,
  CheckoutDeliveryService,
  I18nTestingModule,
  RoutingService, StateWithCheckout, StateWithProcess,
  UserAddressService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { Card, CheckoutConfigService,  } from '@spartacus/storefront';
import {Store, StoreModule} from '@ngrx/store';

import { MakaShippingAddressComponent } from './maka-shipping-address.component';
import createSpy = jasmine.createSpy;
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';
import {MakaBaseSite} from '../../../../core/models/maka-site.model';
import {EnvironmentType} from '../../../../core/models/maka-globals-vars.model';
import {MakaBaseSiteService} from '../../../../shared/services/maka-base-site/maka-base-site.service';

class MockUserAddressService {
  getAddresses(): Observable<Address[]> {
    return of([]);
  }
  getAddressesLoading(): Observable<boolean> {
    return of();
  }
  loadAddresses(): void {}
}

class MockActiveCartService {
  isGuestCart(): boolean {
    return false;
  }

  getActive(): Observable<Cart> {
    return of({} as Cart);
  }
}

class MockCheckoutDeliveryService {
  createAndSetAddress = createSpy();
  setDeliveryAddress = createSpy();
  getDeliveryAddress(): Observable<Address> {
    return of(null);
  }
}

class MockRoutingService {
  go = createSpy();
}

class MockCheckoutConfigService {
  getPreviousCheckoutStepUrl(): string {
    return '';
  }

  getNextCheckoutStepUrl(): string {
    return 'checkout/delivery-mode';
  }
}

class MockMakaActiveCartService {
  static isCartRecurrenceConfigurationValid(cart: any): boolean {
    return true;
  }
}

const mockAddress1: Address = {
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'first line',
  line2: 'second line',
  town: 'town',
  id: 'id',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
};

const mockAddress2: Address = {
  firstName: 'Alice',
  lastName: 'Smith',
  titleCode: 'mrs',
  line1: 'other first line',
  line2: 'other second line',
  town: 'other town',
  id: 'id2',
  region: { isocode: 'JP-27' },
  postalCode: 'other zip',
  country: { isocode: 'JP' },
  defaultAddress: true,
};

const mockAddresses: Address[] = [mockAddress1, mockAddress2];

const mockActivatedRoute = {
  snapshot: {
    url: ['checkout', 'delivery-mode'],
  },
};

@Component({
  selector: 'app-cx-address-form',
  template: '',
})
class MockAddressFormComponent {
  @Input() cancelBtnLabel: string;
  @Input() showTitleCode: boolean;
  @Input() setAsDefaultField: boolean;
  @Input() addressData: Address;
}

@Component({
  selector: 'app-cx-spinner',
  template: '',
})
class MockSpinnerComponent {}

@Component({
  selector: 'app-cx-card',
  template: '',
})
class MockCardComponent {
  @Input()
  border: boolean;
  @Input()
  content: Card;
  @Input()
  fitToContainer: boolean;
}

class MockMakaBaseSiteService {
  getBaseSiteData(): Observable<MakaBaseSite> {
    return of({
      uid: 'maka-store',
      countries: [],
      languages: [],
      environmentType: EnvironmentType.DEVELOPMENT,
      openPay3DSMin: 6000
    });
  }
}

describe('MakaShippingAddressComponent', () => {
  let component: MakaShippingAddressComponent;
  let fixture: ComponentFixture<MakaShippingAddressComponent>;
  let mockCheckoutDeliveryService: CheckoutDeliveryService;
  let mockUserAddressService: UserAddressService;
  let mockRoutingService: RoutingService;
  let mockActiveCartService: ActiveCartService;
  let mockMakaActiveCartService: MockMakaActiveCartService;
  let store: Store<StateWithCheckout | StateWithProcess<void>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        StoreModule.forRoot({}),
      ],
      declarations: [
        MakaShippingAddressComponent,
        MockAddressFormComponent,
        MockCardComponent,
        MockSpinnerComponent,
      ],
      providers: [
        { provide: UserAddressService, useClass: MockUserAddressService },
        { provide: ActiveCartService, useClass: MockActiveCartService },
        { provide: MakaActiveCartService, useClass: MockMakaActiveCartService },
        { provide: CheckoutDeliveryService, useClass: MockCheckoutDeliveryService },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: CheckoutConfigService, useClass: MockCheckoutConfigService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MakaBaseSiteService, useClass: MockMakaBaseSiteService },
        { provide: CurrencyPipe }
      ],
    })
      .overrideComponent(MakaShippingAddressComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    store = TestBed.inject(Store);
    mockCheckoutDeliveryService = TestBed.inject(CheckoutDeliveryService);
    mockRoutingService = TestBed.inject(RoutingService);
    mockActiveCartService = TestBed.inject(ActiveCartService);
    mockMakaActiveCartService = TestBed.inject(MakaActiveCartService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaShippingAddressComponent);
    component = fixture.componentInstance;
    mockUserAddressService = TestBed.inject(UserAddressService);

    spyOn(component, 'addAddress').and.callThrough();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
