import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  Input,
  OnDestroy,
  OnInit, PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MakaScriptTagService } from 'src/app/shared/services/maka-script-tag.service';
import { environment } from 'src/environments/environment';
import { MakaPaymentPaypalService } from './maka-paypal.service';
import { PaypalAuthorizeResponse, PaypalCreateResponse, PaypalOrderStatus } from './maka-paypal.model';
import { ActiveCartService, AuthService, CheckoutService } from '@spartacus/core';
import { PaymentMode } from '../maka-payment-method.model';
import { isPlatformBrowser } from '@angular/common';
import { MakaPlaceOrderService } from '../../place-order/maka-place-order.service';


// eslint-disable-next-line
declare var paypal: any;

@Component({
  selector: 'app-maka-payment-paypal',
  templateUrl: './maka-paypal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaPaypalComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('payment') paypalPayment: PaymentMode;
  @Input() disableBtn: boolean;

  readonly paypalScriptId = 'paypal-script';
  readonly paypalScriptSection = 'body';

  cartId: string;
  userId: string;
  isLoading$ = new BehaviorSubject(false);
  scriptLoaded = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private scriptTagService: MakaScriptTagService,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private paypalService: MakaPaymentPaypalService,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private activeCartService: ActiveCartService,
    private makaPlaceOrderService: MakaPlaceOrderService,
    @Inject(PLATFORM_ID) private platform: any
  ) {
  }

  get paypalUserId(): string {
    return this.paypalPayment.payPalClientId;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.showCTA();
    }
    this.getParamsForPaypalRequests();
  }

  showCTA(): void {
    this.isLoading$.next(true);
    this.scriptTagService.removeScript(this.renderer, this.paypalScriptId, this.paypalScriptSection);
    this.scriptTagService.addScript({
        renderer: this.renderer,
        type: 'text/javascript',
        src: `${environment.externalUrls.paypal}${this.paypalUserId}`,
        id: this.paypalScriptId,
        charset: 'UTF-8',
        section: this.paypalScriptSection,
        text: null,
        onload: () => {
          this.isLoading$.next(false);
          this.scriptLoaded = true;
          this.configure();
          this.changeDetector.markForCheck();
        }
      }
    );
  }

  private configure(): void {
    paypal.Buttons({
      style: {
        shape:   'pill',
        label:   'pay'
      },
      // createOrder() is called when the paypal button is clicked
      createOrder: () => {
        return this.paypalService.createOrder(this.userId, this.cartId)
          .toPromise()
          .then(
            (data: PaypalCreateResponse) => {
              return data.payPalOrderId;
            },
            (error) => {
              this.paypalService.handlePaymentError();
            }
          );
      },
      // onApprove() is called when the buyer approves the payment in paypal
      onApprove: () => {
        // place order loading
        this.makaPlaceOrderService.updatePlaceOrderBtn(true);
        this.paypalService.captureOrder(this.userId, this.cartId).subscribe(
          data => {
            this.handleAuthOrderResult(data);
          },
          () => {
            this.makaPlaceOrderService.updatePlaceOrderBtn(false);
            this.paypalService.handlePaymentError();
          }
        );

        this.changeDetector.markForCheck();
      },
      onError: (error) => {
        this.makaPlaceOrderService.updatePlaceOrderBtn(false);
        this.paypalService.handlePaymentError();
      },
      onCancel: () => {
        // @TODO to add cancel event for GTM
        console.log('Cancelling payment');
      }
    }).render('#paypal-button-container');
  }

  private handleAuthOrderResult(data: PaypalAuthorizeResponse): void {
    if (data.payPalOrderStatus === PaypalOrderStatus.COMPLETED) {
      this.checkoutService.placeOrder();
    } else {
      this.paypalService.handlePaymentError();
    }
  }

  /**
   * Params for PUT /paymentmode invoked on submit form
   */
  private getParamsForPaypalRequests(): void {
    combineLatest([
      this.authService.getOccUserId(),
      this.activeCartService.getActiveCartId(),
    ]).pipe(
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      ([userId, cartId]) => {
        this.userId = userId;
        this.cartId = cartId;
      }
    );
  }

  ngOnDestroy(): void {
    this.makaPlaceOrderService.updatePlaceOrderBtn(false);
    if (this.scriptLoaded) {
      this.scriptTagService.removeScript(
        this.renderer,
        this.paypalScriptId,
        this.paypalScriptSection
      );
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
