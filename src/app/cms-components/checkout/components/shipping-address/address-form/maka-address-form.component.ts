import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {AddressFormComponent, CheckoutConfigService, ModalService} from '@spartacus/storefront';
import {Address, ErrorModel, RoutingService} from '@spartacus/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  AddressValidation,
  GlobalMessageService,
  GlobalMessageType,
  Region,
  UserAddressService,
  UserService
} from '@spartacus/core';

import { MakaCheckoutDeliveryService } from '../../../../../core/checkout/facade/maka-checkout-delivery.service';
import { MakaAddress } from '../../../../../core/models';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-maka-address-form',
  templateUrl: './maka-address-form.component.html',
})
export class MakaAddressFormComponent extends AddressFormComponent implements OnInit, OnDestroy {

  @Input()
  makaAddressData: MakaAddress;

  @Input()
  setAsDefaultField = true;

  @Input()
  showCancelBtn = true;

  @Input()
  displayCheckoutSummary = false;

  @Input()
  displayDeliveryModes = false;

  @Output()
  submitAddress = new EventEmitter<any>();

  @Output()
  backToAddress = new EventEmitter<any>();

  addressForm: FormGroup = this.fb.group({
    country: environment.defaultCountry,
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    petName: [''],
    streetName: ['', Validators.required],
    streetNumber: ['', Validators.required],
    appartement: [''],
    reference: [''],
    district: ['', Validators.required],
    town: ['', Validators.required],
    region: this.fb.group({
      isocode: [null, Validators.required],
    }),
    postalCode: ['', [Validators.required, Validators.pattern(environment.mexicanPostalCodeFormat)]],
    cellphone: ['', [Validators.required, Validators.pattern(environment.mexicanCellphoneFormat)]],
    defaultAddress: [false]
  });
  selectedAddress$: Observable<Address>;
  existingAddresses$: Observable<Address[]>;
  forceLoader = false; // this helps with smoother steps transition


  constructor(
    fb: FormBuilder,
    checkoutDeliveryService: MakaCheckoutDeliveryService,
    userService: UserService,
    userAddressService: UserAddressService,
    globalMessageService: GlobalMessageService,
    modalService: ModalService,
    protected activatedRoute: ActivatedRoute,
    protected checkoutConfigService: CheckoutConfigService,
    protected routingService: RoutingService
  )
  {
    super(fb, checkoutDeliveryService, userService, userAddressService, globalMessageService, modalService);
  }

  verifyAddress(): void {
    if (this.addressForm.valid) {
      if (this.addressForm.get('region').value.isocode) {
        this.regionsSub = this.regions$.pipe(take(1)).subscribe((regions) => {
          const obj = regions.find(
            (region) =>
              region.isocode ===
              this.addressForm.controls['region'].value.isocode
          );
          Object.assign(this.addressForm.value.region, {
            isocodeShort: obj.isocodeShort,
            name: obj.name
          });
        });
      }

      if (this.addressForm.dirty) {
        this.checkoutDeliveryService.verifyAddress(this.addressForm.value);
      } else {
        // address form value not changed
        // ignore duplicate address
        this.submitAddress.emit(undefined);
      }
    } else {
      this.addressForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.regions$ = this.userAddressService.getRegions(environment.defaultCountry.isocode).pipe(
      tap((regions: Region[]) => {
        const regionControl = this.addressForm.get('region.isocode');
        if (regions && regions.length > 0) {
          regionControl.enable();
        } else {
          regionControl.disable();
        }
      })
    );

    // verify the new added address
    this.addressVerifySub = this.checkoutDeliveryService
      .getAddressVerificationResults()
      .subscribe((results: AddressValidation) => {
        if (results.decision === 'FAIL') {
          this.checkoutDeliveryService.clearAddressVerificationResults();
        } else if (results.decision === 'ACCEPT') {
          this.submitAddress.emit(this.addressForm.value);
        } else if (results.decision === 'REJECT') {
          this.displayValidationErrors(results.errors);
          this.checkoutDeliveryService.clearAddressVerificationResults();
        } else if (results.decision === 'REVIEW') {
          this.openSuggestedAddress(results);
        }
      });

    if (this.makaAddressData && Object.keys(this.makaAddressData).length !== 0) {
      this.addressForm.patchValue(this.makaAddressData);

      if (this.makaAddressData.region) {
        this.regionSelected(this.makaAddressData.region);
      }
    }

    this.selectedAddress$ = this.checkoutDeliveryService.getDeliveryAddress();
  }

  goNext(): void {
    this.routingService.go(
      this.checkoutConfigService.getNextCheckoutStepUrl(this.activatedRoute)
    );
  }

  /**
   * Display global error messages
   * @param array of error messages returned by the OCC API
   */
  private displayValidationErrors(errors: { errors: ErrorModel[] }): void {
    if (errors.errors?.length) {
      errors.errors.forEach(error => {
        this.globalMessageService.add(
          {
            key: `httpHandlers.validationErrors.${error.reason}.${error.subject}`,
          },
          GlobalMessageType.MSG_TYPE_ERROR
        );
      });
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
