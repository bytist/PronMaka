import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  DeliveryMode,
  RoutingService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CheckoutConfigService } from '@spartacus/storefront';

import { MakaCheckoutDeliveryService } from '../../../../../core/checkout/facade/maka-checkout-delivery.service';

@Component({
  selector: 'app-maka-delivery-modes',
  templateUrl: './maka-delivery-modes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaDeliveryModesComponent implements OnInit, OnDestroy {
  supportedDeliveryModes$: Observable<DeliveryMode[]>;
  currentDeliveryModeId: string;
  checkoutStepUrlNext: string;
  checkoutStepUrlPrevious: string;
  disableOptions = false;
  private allowRedirect = false;

  deliveryModeSub: Subscription;

  mode: FormGroup = this.fb.group({
    deliveryModeId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private checkoutDeliveryService: MakaCheckoutDeliveryService,
    private routingService: RoutingService,
    private checkoutConfigService: CheckoutConfigService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkoutStepUrlNext = this.checkoutConfigService.getNextCheckoutStepUrl(
      this.activatedRoute
    );
    this.checkoutStepUrlPrevious = this.checkoutConfigService.getPreviousCheckoutStepUrl(
      this.activatedRoute
    );

    this.checkoutDeliveryService.loadSupportedDeliveryModes();
    this.supportedDeliveryModes$ = this.checkoutDeliveryService.getSupportedDeliveryModes();
    this.deliveryModeSub = this.supportedDeliveryModes$
      .pipe(
        withLatestFrom(
          this.checkoutDeliveryService
            .getSelectedDeliveryMode()
            .pipe(
              map((deliveryMode: DeliveryMode) =>
                deliveryMode && deliveryMode.code ? deliveryMode.code : null
              )
            )
        )
      )
      .subscribe(([deliveryModes, code]: [DeliveryMode[], string]) => {
        if (!code && deliveryModes && deliveryModes.length) {
          code = this.checkoutConfigService.getPreferredDeliveryMode(
            deliveryModes
          );
        }
        if (
          this.allowRedirect &&
          !!code &&
          code === this.currentDeliveryModeId
        ) {
          this.routingService.go(this.checkoutStepUrlNext);
        }
        if (code) {
          this.mode.controls['deliveryModeId'].setValue(code);
          if (code !== this.currentDeliveryModeId) {
            this.checkoutDeliveryService.setDeliveryMode(code);
          }
        }
        this.currentDeliveryModeId = code;
      });
  }

  changeMode(code: string): void {
    if (code !== this.currentDeliveryModeId) {
      this.disableOptions = true;
      this.checkoutDeliveryService.setDeliveryMode(code);
      this.currentDeliveryModeId = code;

      // TODO: Revisit this later, calling the getDeliveryMode method on demand might let us remove the timeout
      setTimeout(() => {
        this.disableOptions = false;
      }, 500);
    }
  }

  get deliveryModeInvalid(): boolean {
    return this.mode.controls['deliveryModeId'].invalid;
  }

  ngOnDestroy(): void {
    if (this.deliveryModeSub) {
      this.deliveryModeSub.unsubscribe();
    }
  }
}
