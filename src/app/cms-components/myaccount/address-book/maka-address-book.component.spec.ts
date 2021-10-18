import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  CheckoutDeliveryService,
  I18nTestingModule,
  User,
  UserAddressService
} from '@spartacus/core';
import {
  BehaviorSubject,
  Observable,
  of
} from 'rxjs';
import {
  Component, DebugElement,
  EventEmitter,
  Input,
  Output, Type
} from '@angular/core';
import {
  AddressBookComponentService,
  CardModule,
  SpinnerModule,
  Card
} from '@spartacus/storefront';
import { By } from '@angular/platform-browser';

import { MakaAddressBookComponent } from './maka-address-book.component';
import { MakaAddress } from '../../../core/models';

const mockAddress: MakaAddress = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  streetName: 'New Park',
  streetNumber: '123',
  appartement: '12',
  reference: 'Some reference',
  district: 'El Alamo',
  town: 'Guadalajara',
  region: { isocode: 'MX-JAL' },
  postalCode: '45656',
  country: { isocode: 'MX' },
  cellphone: '123123123',
  defaultAddress: false,
};

const mockUser: User = {
  uid: '1234',
};

const isLoading = new BehaviorSubject<boolean>(false);

class MockComponentService {
  loadAddresses = jasmine.createSpy();
  addUserAddress = jasmine.createSpy();
  updateUserAddress = jasmine.createSpy();
  getAddressesStateLoading(): Observable<boolean> {
    return isLoading.asObservable();
  }
  getAddresses(): Observable<MakaAddress[]> {
    return of([mockAddress, mockAddress, mockAddress]);
  }
  getUserId(): Observable<string> {
    return of(mockUser.uid);
  }
}

@Component({
  selector: 'app-maka-address-form',
  template: '',
})
class MockMakaAddressFormComponent {
  @Input()
  makaAddressData: MakaAddress;

  @Input()
  actionBtnLabel: string;

  @Input()
  cancelBtnLabel: string;

  @Input()
  setAsDefaultField: boolean;

  @Input()
  showTitleCode: boolean;

  @Input()
  showCancelBtn: boolean;

  @Output()
  submitAddress = new EventEmitter<any>();

  @Output()
  backToAddress = new EventEmitter<any>();
}

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

class MockCheckoutDeliveryService {
  clearCheckoutDeliveryDetails = jasmine.createSpy();
}

class MockUserAddressService {
  deleteUserAddress = jasmine.createSpy();
  setAddressAsDefault = jasmine.createSpy();
}

describe('MakaAddressBookComponent', () => {
  let component: MakaAddressBookComponent;
  let fixture: ComponentFixture<MakaAddressBookComponent>;
  let el: DebugElement;
  let userAddressService: UserAddressService;
  let checkoutDeliveryService: CheckoutDeliveryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SpinnerModule,
        I18nTestingModule,
        CardModule
      ],
      providers: [
        { provide: AddressBookComponentService, useClass: MockComponentService },
        { provide: UserAddressService, useClass: MockUserAddressService },
        { provide: CheckoutDeliveryService, useClass: MockCheckoutDeliveryService }
      ],
      declarations: [ MakaAddressBookComponent, MockMakaAddressFormComponent, MockCardComponent ]
    })
    .compileComponents();

    userAddressService = TestBed.inject(UserAddressService);
    checkoutDeliveryService = TestBed.inject(CheckoutDeliveryService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaAddressBookComponent);
    component = fixture.componentInstance;
    spyOn(component, 'addAddressButtonHandle');
    el = fixture.debugElement;

    isLoading.next(false);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner if addresses are loading', () => {
    isLoading.next(true);
    fixture.detectChanges();
    expect(el.query(By.css('cx-spinner'))).toBeTruthy();
  });

  it('should show address cards after loading', () => {
    expect(el.query(By.css('cx-card'))).toBeTruthy();
  });

  it('should address cards number to be equal with addresses count', () => {
    expect(el.queryAll(By.css('cx-card')).length).toEqual(3);
  });

  it('should be able to add new address', () => {
    el.query(By.css('.btn-action')).nativeElement.click();
    expect(component.addAddressButtonHandle).toHaveBeenCalled();
  });

  it('should call addAddressButtonHandle()', () => {
    component.addAddressButtonHandle();

    expect(component.addAddressButtonHandle).toHaveBeenCalledWith();
  });

  it('should call editAddressButtonHandle(address: Address)', () => {
    spyOn(component, 'editAddressButtonHandle');
    component.editAddressButtonHandle(mockAddress);

    expect(component.editAddressButtonHandle).toHaveBeenCalledWith(mockAddress);
  });

  it('should call addAddressSubmit(address: Address)', () => {
    spyOn(component, 'addAddressSubmit');
    component.addAddressSubmit(mockAddress);

    expect(component.addAddressSubmit).toHaveBeenCalledWith(mockAddress);
  });

  it('should call addAddressCancel()', () => {
    spyOn(component, 'addAddressCancel');
    component.addAddressCancel();

    expect(component.addAddressCancel).toHaveBeenCalledWith();
  });

  it('should call editAddressSubmit(address: Address)', () => {
    spyOn(component, 'editAddressSubmit');
    component.editAddressSubmit(mockAddress);

    expect(component.editAddressSubmit).toHaveBeenCalledWith(mockAddress);
  });

  it('should call editAddressCancel()', () => {
    spyOn(component, 'editAddressCancel');
    component.editAddressCancel();

    expect(component.editAddressCancel).toHaveBeenCalledWith();
  });

  it('should display address data', () => {
    const element = el.query(By.css('cx-card'));
    expect(element.nativeElement.textContent).toContain(
      mockAddress.firstName &&
      mockAddress.lastName &&
      mockAddress.streetName &&
      mockAddress.streetNumber &&
      mockAddress.appartement &&
      mockAddress.district &&
      mockAddress.town &&
      mockAddress.region.isocode &&
      mockAddress.country.isocode &&
      mockAddress.postalCode &&
      mockAddress.cellphone
    );
  });

  it('should display default label on address default', () => {
    mockAddress.defaultAddress = true;
    fixture.detectChanges();
    const element = el.query(By.css('.card-header'));
    expect(element.nativeElement.textContent).toContain(
      'addressCard.default'
    );
  });

  describe('setAddressAsDefault', () => {
    it('should set Address as default', () => {
      component.setAddressAsDefault(mockAddress[0]);
      expect(userAddressService.setAddressAsDefault).toHaveBeenCalledWith(
        mockAddress[0]
      );
    });

    it('should clear checkout delivery details', () => {
      component.setAddressAsDefault(mockAddress[0]);
      expect(
        checkoutDeliveryService.clearCheckoutDeliveryDetails
      ).toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    it('should set delete user Address', () => {
      component.deleteAddress('1');
      expect(userAddressService.deleteUserAddress).toHaveBeenCalledWith('1');
    });

    it('should clear checkout delivery details', () => {
      component.deleteAddress('1');
      expect(
        checkoutDeliveryService.clearCheckoutDeliveryDetails
      ).toHaveBeenCalled();
    });
  });
});
