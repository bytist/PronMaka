import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, map, take, takeUntil } from 'rxjs/operators';
import { AuthService, Region, UserAddressService } from '@spartacus/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';

import { MakaActiveCartService } from '../../../../../shared/services/maka-cart/maka-active-cart.service';
import { environment } from '../../../../../../environments/environment';
import { MakaAddress } from '../../../../../core/models';
import { MakaCart } from '../../../../../core/models/maka-cart.model';
import { MakaPaymentMethodService } from '../../../../../shared/services/maka-payment-method/maka-payment-method.service';


/**
 * Component separated from paymentMethodComponent to handle credit card separated
 */
@Component({
  selector: 'app-maka-billing-form',
  templateUrl: './maka-billing-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaBillingFormComponent implements OnInit, OnDestroy {

  @Input() saveBillingData: boolean;
  @Output() preventNext = new EventEmitter<boolean>();

  isBillingAddressSameAsShipping = true;
  unsubscribe$ = new Subject<void>();
  cart: MakaCart;
  regions$: Observable<Region[]>;
  endpointParams: {userId: string, cartId: string};

  paymentAddressForm: FormGroup = this.fb.group({
    rfc: ['', [Validators.required, Validators.pattern(environment.rfcFormat)]],
    legalEntityName: ['', Validators.required],
    streetName: [''],
    streetNumber: [''],
    appartement: [''],
    district: [''],
    town: [''],
    region: this.fb.group({
      isocode: [null],
    }),
    postalCode: [''],
    country: environment.defaultCountry,
  });

  constructor(private authService: AuthService,
              private makaActiveCartService: MakaActiveCartService,
              private fb: FormBuilder,
              private userAddressService: UserAddressService,
              private paymentMethodService: MakaPaymentMethodService,
              private changeDetector: ChangeDetectorRef) {}

  get formCtrls(): any {
    return this.paymentAddressForm.controls;
  }

  ngOnInit() {
    this.loadPaymentAddress();
    this.loadRegions();

    this.makaActiveCartService.getCartParamsRequest(this.unsubscribe$)
      .subscribe(( [userId, cartId]) => {
        this.endpointParams = { userId, cartId };
      });

    this.paymentMethodService.isGoNextTriggered$
      .pipe(
        filter(isTriggered => isTriggered),
        takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.addPaymentAddress();
        this.paymentAddressForm.markAllAsTouched();
        this.changeDetector.detectChanges();
      });
  }

  togglePaymentAddressSameAsShippingAddress(): void {
    this.isBillingAddressSameAsShipping = !this.isBillingAddressSameAsShipping;

    if (this.isBillingAddressSameAsShipping) {
      // Uncheck checkbox
      this.paymentAddressForm.patchValue({
        streetName: '',
        streetNumber: '',
        appartement: '',
        district: '',
        town: '',
        region: {isocode: null},
        postalCode: '',
        country: environment.defaultCountry
      });
      this.removeFormValidations();
    } else {
      this.addFormValidations();
    }
    this.updateFormValidations();
  }

  /**
   * Add address for billing if is different than Address delivery
   */
  addPaymentAddress(): void {
    if (this.paymentAddressForm.status === 'VALID' && this.cart.deliveryAddress) {
      if (this.isBillingAddressSameAsShipping) {
        const deliveryAddress = this.cart.deliveryAddress as MakaAddress;
        const { streetName, streetNumber, appartement, district, town, region, postalCode, country} = deliveryAddress;

        this.paymentAddressForm.patchValue({
          streetName,
          streetNumber,
          appartement,
          district,
          town,
          region,
          postalCode,
          country,
        });
      }

      this.makaActiveCartService
        .createCartPaymentAddress(this.endpointParams.cartId, this.endpointParams.userId, this.paymentAddressForm.value)
        .pipe(
          take(1),
          catchError(error => {
            this.paymentMethodService.setIsBillingFormValid(false);
            return throwError(error);
          }),
          takeUntil(this.unsubscribe$),
        ).subscribe(() => {
          this.paymentMethodService.setIsBillingFormValid(true);  // Billing is valid
      });
    } else {
      this.paymentMethodService.setIsBillingFormValid(false);
    }
  }

  // @TODO replace compare with lodash function
  isPaymentAddressSameAsDeliveryAddress(paymentAddress: MakaAddress, deliveryAddress: MakaAddress): boolean {
    if (paymentAddress && deliveryAddress) {
      return this.toLowerOrDefault(paymentAddress?.streetName) === this.toLowerOrDefault(deliveryAddress?.streetName)
        && paymentAddress?.streetNumber === deliveryAddress?.streetNumber
        && paymentAddress?.appartement === deliveryAddress?.appartement
        && this.toLowerOrDefault(paymentAddress?.district) === this.toLowerOrDefault(deliveryAddress?.district)
        && this.toLowerOrDefault(paymentAddress?.town) === this.toLowerOrDefault(deliveryAddress?.town)
        && paymentAddress?.region?.isocode === deliveryAddress?.region?.isocode
        && paymentAddress?.postalCode === deliveryAddress?.postalCode
        && paymentAddress?.country?.isocode === deliveryAddress?.country?.isocode;
    }
    return false;
  }

  private toLowerOrDefault(text: string) {
    return text ? text.toLocaleLowerCase() : '';
  }

  private loadPaymentAddress(): void {
    this.makaActiveCartService.getActive()
      .pipe(
        filter(Boolean),
        map(cart => cart as MakaCart),
        takeUntil(this.unsubscribe$),
      ).subscribe((cart) => {
        this.cart = cart;
        const containsPaymentAddress = cart?.paymentAddress ? true : false;

        if (containsPaymentAddress) {
          this.isBillingAddressSameAsShipping = this.isPaymentAddressSameAsDeliveryAddress(cart.paymentAddress, cart.deliveryAddress);
          this.paymentAddressForm.patchValue(cart.paymentAddress);

          // If paymentAddress exists form is displayed:
          this.addFormValidations();
          this.updateFormValidations();
        }
      });
  }

  private loadRegions(): void {
    this.regions$ = this.userAddressService.getRegions(environment.defaultCountry.isocode);
    this.regions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((regions) => {
        const regionControl = this.paymentAddressForm.get('region.isocode');
        if (regions.length > 0) {
          regionControl.enable();
        } else {
          regionControl.disable();
        }
      });
  }

  private addFormValidations() {
    this.formCtrls.streetName.setValidators([Validators.required]);
    this.formCtrls.streetNumber.setValidators(Validators.required);
    this.formCtrls.district.setValidators(Validators.required);
    this.formCtrls.town.setValidators(Validators.required);
    this.formCtrls.region.controls.isocode.setValidators(Validators.required);
    this.formCtrls.postalCode.setValidators([Validators.required, Validators.pattern(environment.mexicanPostalCodeFormat)]);
  }

  private removeFormValidations() {
    this.formCtrls.streetName.clearValidators();
    this.formCtrls.streetNumber.clearValidators();
    this.formCtrls.district.clearValidators();
    this.formCtrls.town.clearValidators();
    this.formCtrls.region.controls.isocode.clearValidators();
    this.formCtrls.postalCode.clearValidators();
  }

  private updateFormValidations() {
    this.formCtrls.streetName.updateValueAndValidity();
    this.formCtrls.streetNumber.updateValueAndValidity();
    this.formCtrls.district.updateValueAndValidity();
    this.formCtrls.town.updateValueAndValidity();
    this.formCtrls.region.controls.isocode.updateValueAndValidity();
    this.formCtrls.postalCode.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
