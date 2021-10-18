import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ShippingAddressComponent, CheckoutConfigService, Card } from '@spartacus/storefront';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { take, filter, map, takeUntil, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {
  UserAddressService,
  RoutingService,
  TranslationService,
  ActiveCartService,
  Address,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';

import { MakaCheckoutDeliveryService } from '../../../../core/checkout/facade/maka-checkout-delivery.service';
import { MakaAddress } from 'src/app/core/models/maka-address.model';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';
import { MakaCart } from '../../../../core/models/maka-cart.model';
import { MakaBaseSiteService } from '../../../../shared/services/maka-base-site/maka-base-site.service';

const WHITESPACE_SEPARATOR = ' ';
const COMMA_SEPARATOR = ', ';
const DASH_SEPARATOR = ' - ';

@Component({
  selector: 'app-maka-shipping-address',
  templateUrl: './maka-shipping-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaShippingAddressComponent extends ShippingAddressComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  openPay3DSMin$ = this.makaBaseSiteService
    .getBaseSiteData()
    .pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged(),
      map((baseSite) => baseSite.openPay3DSMin));

  activeCart$: Observable<MakaCart> = this.activeCartService.getActive()
    .pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$)
    );
  activeCart: MakaCart;

  constructor(
    userAddressService: UserAddressService,
    routingService: RoutingService,
    checkoutDeliveryService: MakaCheckoutDeliveryService,
    checkoutConfigService: CheckoutConfigService,
    activatedRoute: ActivatedRoute,
    translation: TranslationService,
    activeCartService: ActiveCartService,
    protected globalMessageService: GlobalMessageService,
    protected makaBaseSiteService: MakaBaseSiteService,
    protected currencyPipe: CurrencyPipe
  ) {
    super(
      userAddressService,
      routingService,
      checkoutDeliveryService,
      checkoutConfigService,
      activatedRoute,
      translation,
      activeCartService
    );
  }

  ngOnInit() {
    this.isLoading$ = this.userAddressService.getAddressesLoading();
    this.existingAddresses$ = this.userAddressService.getAddresses();
    this.selectedAddress$ = this.checkoutDeliveryService.getDeliveryAddress();

    this.cards$ = combineLatest([
      this.existingAddresses$,
      this.selectedAddress$,
      this.translation.translate('checkoutAddress.defaultShippingAddress'),
      this.translation.translate('checkoutAddress.shipToThisAddress'),
      this.translation.translate('addressCard.selected'),
    ]).pipe(
      map(
        ([
           addresses,
           selected,
           textDefaultShippingAddress,
           textShipToThisAddress,
           textSelected,
         ]) => {
          // Select default address if none selected
          if (
            addresses.length &&
            (!selected || Object.keys(selected).length === 0)
          ) {
            const defaultAddress = addresses.find(
              (address) => address.defaultAddress
            );
            selected = defaultAddress;
            this.selectAddress(defaultAddress);
          }

          return addresses.map((address) => {
            const card = this.getCardContent(
              address,
              selected,
              textDefaultShippingAddress,
              textShipToThisAddress,
              textSelected
            );
            return {
              address,
              card,
            };
          });
        }
      )
    );

    this.activeCart$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cart) => {
      this.activeCart = cart as MakaCart;
    });

    if (!this.activeCartService.isGuestCart()) {
      this.userAddressService.loadAddresses();
    } else {
      this.isGuestCheckout = true;
    }
  }

  getCardContent(
    address: MakaAddress,
    selected: any,
    textDefaultShippingAddress: string,
    textShipToThisAddress: string,
    textSelected: string
  ): Card {
    let region = '';

    if (address.region) {
      if (address.region.name) {
        region = address.region.name + COMMA_SEPARATOR;
      } else {
        region = address.region.isocode + COMMA_SEPARATOR;
      }
    }

    let line1 = address.streetName + WHITESPACE_SEPARATOR + address.streetNumber;

    if (address.appartement) {
      line1 = line1 + DASH_SEPARATOR + address.appartement;
    }

    return {
      title: address.defaultAddress ? textDefaultShippingAddress : '',
      textBold: address.firstName + WHITESPACE_SEPARATOR + address.lastName,
      text: [
        line1,
        address.district,
        address.town + COMMA_SEPARATOR + region + address.country.isocode,
        address.postalCode,
        address.cellphone
      ],
      actions: [{ name: textShipToThisAddress, event: 'send' }],
      header: selected && selected.id === address.id ? textSelected : '',
    };
  }

  addAddress(address: Address): void {
    this.forceLoader = true;
    this.selectedAddress$
      .pipe(
        filter((selected) => !!selected),
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        return this.goNext();
      });

    this.existingAddresses$.pipe(
      take(1),
      takeUntil(this.unsubscribe$) // normally would be enough with take(1), but could not emit nothing  existingAddresses$
    ).subscribe((addresses) => {
      addresses.includes(address)
        ? this.selectAddress(address)
        : this.checkoutDeliveryService.createAndSetAddress(address);
    });
  }

  goNext() {
    combineLatest([
      this.openPay3DSMin$,
      this.activeCart$,
    ]).pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged(),
      switchMap(([openPay3DSMin, activeCart]) =>
        combineLatest([
          of(openPay3DSMin),
          of(activeCart),
          this.translation.translate('checkoutAddress.invalidRecurrenceOrder', { openPay3DSMin: this.currencyPipe.transform(openPay3DSMin)})
        ])
      )
    )
    .subscribe(([openPay3DSMin, cart, errorMessage]) => {
      if (Boolean(cart.recurrence) && !MakaActiveCartService
        .isCartRecurrenceConfigurationValid(this.activeCart, openPay3DSMin)) {
        this.globalMessageService.add(errorMessage, GlobalMessageType.MSG_TYPE_ERROR);
        return;
      }
      super.goNext();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
