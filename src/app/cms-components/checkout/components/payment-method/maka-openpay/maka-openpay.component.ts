import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit, Output,
} from '@angular/core';
import { CheckoutConfigService, PaymentMethodComponent } from '@spartacus/storefront';
import {
  ActiveCartService,
  Address,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  CheckoutService, GlobalMessageService,
  PaymentDetails, RoutingService, TranslationService,
  UserPaymentService
} from '@spartacus/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MakaPaymentMethodService } from '../../../../../shared/services/maka-payment-method/maka-payment-method.service';


/**
 * Component separated from paymentMethodComponent to handle credit card separated
 */
@Component({
  selector: 'app-maka-openpay',
  templateUrl: './maka-openpay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOpenpayComponent extends PaymentMethodComponent implements OnInit, OnDestroy {

  @HostBinding('class.new-payment') get toggleClass() {
    return !this.isDisplayCCSaved(); // Add class to :host component only if is displayed new CC form component
  }
  @Input() saveCC: boolean;
  @Output() preventNext = new EventEmitter<boolean>();

  unsubscribe$ = new Subject<void>();
  existingPaymentMethods: PaymentDetails[] = [];

  constructor(
    protected userPaymentService: UserPaymentService,
    protected checkoutService: CheckoutService,
    protected checkoutDeliveryService: CheckoutDeliveryService,
    protected checkoutPaymentService: CheckoutPaymentService,
    protected globalMessageService: GlobalMessageService,
    protected routingService: RoutingService,
    protected checkoutConfigService: CheckoutConfigService,
    protected activatedRoute: ActivatedRoute,
    protected translation: TranslationService,
    protected activeCartService: ActiveCartService,
    private paymentMethodService: MakaPaymentMethodService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super(userPaymentService, checkoutService, checkoutDeliveryService, checkoutPaymentService, globalMessageService, routingService,
      checkoutConfigService, activatedRoute, translation, activeCartService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.existingPaymentMethods$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(payments => {
        this.existingPaymentMethods = payments;

        if (this.isDisplayCCSaved()) {
          ScrollTrigger.refresh();
        }

        this.changeDetector.detectChanges();
      });

    this.paymentMethodService.isGoNextTriggered$
      .pipe(
        filter(isTriggered => isTriggered),
        takeUntil(this.unsubscribe$))
      .subscribe(() => {
        // Set Valid CC if card saved is selected
        if (this.isDisplayCCSaved()) {
          this.paymentMethodService.setIsCCFormValid(true); // Should have card selected or predeterminated
        }
      });
  }

  /**
   * Add payment details for the current cart and the current user
   */
  setPaymentDetails({
                      paymentDetails,
                      billingAddress,
                    }: { paymentDetails: PaymentDetails; billingAddress?: Address }): void {
    const details: PaymentDetails = {...paymentDetails};
    this.checkoutPaymentService.createPaymentDetails(details);
  }

  /**
   * Return card icon for given code
   * @param code payment card code
   */
  getCardIcon(code: string): string {
    return this.paymentMethodService.getCardIconForCode(code);
  }

  showNewPaymentForm() {
    super.showNewPaymentForm();
  }

  hideNewPaymentForm() {
    super.hideNewPaymentForm();
  }

  isDisplayCCSaved(): boolean {
    return this.existingPaymentMethods.length > 0
      && (typeof this.newPaymentFormManuallyOpened === 'boolean' && !this.newPaymentFormManuallyOpened);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
