// import { ChangeDetectionStrategy } from '@angular/core';
// import {
//   async,
//   ComponentFixture,
//   TestBed
// } from '@angular/core/testing';
// import {
//   FormGroup,
//   ReactiveFormsModule
// } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import {
//   AddressValidation,
//   CheckoutDeliveryService,
//   GlobalMessageService,
//   I18nTestingModule,
//   Region,
//   UserAddressService,
//   UserService,
// } from '@spartacus/core';
// import {
//   Observable,
//   of,
//   Subscription
// } from 'rxjs';
// import createSpy = jasmine.createSpy;
// import {
//   FormErrorsModule,
//   ModalService
// } from '@spartacus/storefront';
//
// import { MakaAddressFormComponent } from './maka-address-form.component';
// import { MakaAddress } from 'src/app/core/models/maka-address.model';
//
// class MockUserService {}
//
// class MockUserAddressService {
//   getRegions(): Observable<Region[]> {
//     return of();
//   }
// }
//
// const mockRegions: Region[] = [
//   {
//     isocode: 'MX-JAL',
//     name: 'Jalisco',
//   },
//   {
//     isocode: 'MX-MEX',
//     name: 'Mexico',
//   },
// ];
//
// const mockAddress: MakaAddress = {
//   id: '123',
//   firstName: 'John',
//   lastName: 'Doe',
//   streetName: 'New Park',
//   streetNumber: '123',
//   appartement: '12',
//   reference: 'Some reference',
//   district: 'El Alamo',
//   town: 'Guadalajara',
//   region: { isocode: 'MX-JAL' },
//   postalCode: '45656',
//   country: { isocode: 'MX' },
//   cellphone: '123123123',
//   defaultAddress: false,
// };
//
// const mockSuggestedAddressModalRef: any = {
//   componentInstance: {
//     enteredAddress: '',
//     suggestedAddresses: '',
//   },
//   result: new Promise((resolve) => {
//     return resolve(true);
//   }),
// };
//
// class MockModalService {
//   open(): any {
//     return mockSuggestedAddressModalRef;
//   }
// }
//
// const mockAddressValidation: AddressValidation = {
//   decision: 'test address validation',
//   suggestedAddresses: [{ id: 'address1' }],
// };
//
// class MockCheckoutDeliveryService {
//   clearAddressVerificationResults = createSpy();
//   verifyAddress = createSpy();
//   getAddressVerificationResults(): Observable<AddressValidation> {
//     return of({ decision: 'ACCEPT' });
//   }
// }
//
// describe('MakaAddressFormComponent', () => {
//   let component: MakaAddressFormComponent;
//   let fixture: ComponentFixture<MakaAddressFormComponent>;
//   let controls: FormGroup['controls'];
//
//   let mockCheckoutDeliveryService: CheckoutDeliveryService;
//   let userAddressService: UserAddressService;
//   let userService: UserService;
//   let mockGlobalMessageService: any;
//   let mockModalService: MockModalService;
//
//   beforeEach(async(() => {
//     mockGlobalMessageService = {
//       add: createSpy(),
//     };
//     mockModalService = new MockModalService();
//
//     TestBed.configureTestingModule({
//       imports: [
//         ReactiveFormsModule,
//         NgSelectModule,
//         I18nTestingModule,
//         FormErrorsModule
//       ],
//       declarations: [MakaAddressFormComponent],
//       providers: [
//         { provide: ModalService, useValue: { open: () => {} } },
//         { provide: CheckoutDeliveryService, useClass: MockCheckoutDeliveryService },
//         { provide: UserService, useClass: MockUserService },
//         { provide: UserAddressService, useClass: MockUserAddressService },
//         { provide: GlobalMessageService, useValue: mockGlobalMessageService },
//         { provide: ModalService, useClass: MockModalService },
//       ],
//     })
//       .overrideComponent(MakaAddressFormComponent, {
//         set: { changeDetection: ChangeDetectionStrategy.Default },
//       })
//       .compileComponents();
//
//     userService = TestBed.inject(UserService);
//     userAddressService = TestBed.inject(UserAddressService);
//     mockCheckoutDeliveryService = TestBed.inject(CheckoutDeliveryService);
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(MakaAddressFormComponent);
//     component = fixture.componentInstance;
//     controls = component.addressForm.controls;
//     component.showTitleCode = true;
//
//     spyOn(component.submitAddress, 'emit').and.callThrough();
//     spyOn(component.backToAddress, 'emit').and.callThrough();
//   });
//
//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should call ngOnInit to get countries, titles and regions data when data exist', () => {
//     spyOn(userAddressService, 'getRegions').and.returnValue(of(mockRegions));
//
//     spyOn(
//       mockCheckoutDeliveryService,
//       'getAddressVerificationResults'
//     ).and.returnValue(of({}));
//
//     component.ngOnInit();
//
//     let regions: Region[];
//     component.regions$
//       .subscribe((data) => {
//         regions = data;
//       })
//       .unsubscribe();
//
//     expect(regions).toBe(mockRegions);
//   });
//
//   it('should add address with address verification result "accept"', () => {
//     spyOn(userAddressService, 'getRegions').and.returnValue(of([]));
//
//     const mockAddressVerificationResult: AddressValidation = {
//       decision: 'ACCEPT',
//     };
//     spyOn(
//       mockCheckoutDeliveryService,
//       'getAddressVerificationResults'
//     ).and.returnValue(of(mockAddressVerificationResult));
//
//     spyOn(component, 'openSuggestedAddress');
//     component.ngOnInit();
//     expect(component.submitAddress.emit).toHaveBeenCalledWith(
//       component.addressForm.value
//     );
//   });
//
//   it('should clear address verification result with address verification result "reject"', () => {
//     spyOn(userAddressService, 'getRegions').and.returnValue(of([]));
//
//     const mockAddressVerificationResult: AddressValidation = {
//       decision: 'REJECT',
//       errors: {
//         errors: [{ subject: 'No' }],
//       },
//     };
//     spyOn(
//       mockCheckoutDeliveryService,
//       'getAddressVerificationResults'
//     ).and.returnValue(of(mockAddressVerificationResult));
//
//     spyOn(component, 'openSuggestedAddress');
//     component.ngOnInit();
//     expect(
//       mockCheckoutDeliveryService.clearAddressVerificationResults
//     ).toHaveBeenCalledWith();
//     mockAddressVerificationResult.errors.errors = [{ subject: 'titleCode' }];
//     component.ngOnInit();
//     expect(mockGlobalMessageService.add).toHaveBeenCalled();
//   });
//
//   it('should clear address verification result with address verification result "fail"', () => {
//     const mockAddressVerificationResult: AddressValidation = {
//       decision: 'FAIL',
//     };
//     component.addressData = mockAddress;
//     spyOn(
//       mockCheckoutDeliveryService,
//       'getAddressVerificationResults'
//     ).and.returnValue(of(mockAddressVerificationResult));
//     component.ngOnInit();
//     expect(
//       mockCheckoutDeliveryService.clearAddressVerificationResults
//     ).toHaveBeenCalled();
//   });
//
//   it('should open suggested address with address verification result "review"', () => {
//     spyOn(userAddressService, 'getRegions').and.returnValue(of([]));
//
//     const mockAddressVerificationResult: AddressValidation = {
//       decision: 'REVIEW',
//     };
//     spyOn(
//       mockCheckoutDeliveryService,
//       'getAddressVerificationResults'
//     ).and.returnValue(of(mockAddressVerificationResult));
//
//     spyOn(component, 'openSuggestedAddress');
//     component.ngOnInit();
//     expect(component.openSuggestedAddress).toHaveBeenCalledWith(
//       mockAddressVerificationResult
//     );
//   });
//
//   it('should unsubscribe from any subscriptions when destroyed', () => {
//     component.regionsSub = new Subscription();
//     spyOn(component.regionsSub, 'unsubscribe');
//     component.ngOnDestroy();
//     expect(component.regionsSub.unsubscribe).toHaveBeenCalled();
//   });
// });
