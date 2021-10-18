import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  CardType,
  CheckoutPaymentService,
  GlobalMessageService,
  GlobalMessageType,
  StateUtils,
} from '@spartacus/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { isBoolean } from 'lodash';

import { MakaCart, MakaPaymentDetails } from 'src/app/core/models/maka-cart.model';
import { MakaOpenpayService } from '../maka-openpay/maka-openpay.service';
import { MakaPaymentMethodService } from '../../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { DebitCards } from '../maka-payment-method.model';
import { MakaEnvironmentService } from '../../../../../shared/services/maka-environment/maka-environment.service';

export const cardFormConstraints = {
  nameMaxChars: 80,
  cardNumberMax: 16,
  cardNumberMin: 12,
  cvvMaxChars: 4,
  cvvMinChars: 3,
  patternOnlyNum: '^[0-9]*$', // only numbers
};

declare var OpenPay: any;

@Component({
  selector: 'app-maka-payment-form',
  templateUrl: './maka-payment-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaPaymentFormComponent implements OnInit, OnDestroy {
  @Input() setAsDefaultField: boolean;
  @Input() paymentMethodsCount: number;

  @Output() goBack = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();
  @Output() setPaymentDetails = new EventEmitter<any>();

  months: string[] = [];
  years: number[] = [];
  cart: MakaCart;
  unsubscribe$ = new Subject<void>();
  cardTypes$: Observable<CardType[]>;
  loading$: Observable<StateUtils.LoaderState<void>>;
  formConstraint = cardFormConstraints;
  openPayReady = false;
  openPayDeviceId: string;
  debitCards = Object.values(DebitCards);

  paymentForm: FormGroup = this.fb.group({
    openpay_device_id: [''],
    cardType: this.fb.group({
      code: [null],
    }),
    accountHolderName: ['', [Validators.required,
                            Validators.maxLength(this.formConstraint.nameMaxChars)]],
    cardNumber: ['', [Validators.required,
                     Validators.maxLength(this.formConstraint.cardNumberMax),
                     Validators.minLength(this.formConstraint.cardNumberMin),
                     Validators.pattern(this.formConstraint.patternOnlyNum)]],
    expiryMonth: [null, Validators.required],
    expiryMonthInput: [''],
    expiryYear: [null, Validators.required],
    expiryYearInput: [''],
    cvn: ['', [Validators.required,
              Validators.maxLength(this.formConstraint.cvvMaxChars),
              Validators.minLength(this.formConstraint.cvvMinChars),
              Validators.pattern(this.formConstraint.patternOnlyNum)]],
    defaultPayment: [false],
  });

  private makaAddressVerifySub: Subscription;
  private envConfigSubscription: Subscription;

  constructor(
    protected checkoutPaymentService: CheckoutPaymentService,
    protected fb: FormBuilder,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private openpayService: MakaOpenpayService,
    private changeDetector: ChangeDetectorRef,
    private paymentMethodService: MakaPaymentMethodService,
    private globalMessageService: GlobalMessageService,
    private makaEnvironmentService: MakaEnvironmentService) {
  }

  get expiryMonthIn() {
    return this.paymentForm.get('expiryMonthInput');
  }

  get expiryMonthSelect() {
    return this.paymentForm.get('expiryMonth');
  }

  get expiryYearIn() {
    return this.paymentForm.get('expiryYearInput');
  }

  get expiryYearSelect() {
    return this.paymentForm.get('expiryYear');
  }

  ngOnInit(): void {
    this.openpayService.addScripts(this.renderer2, this.setupOpenPay.bind(this));

    this.cardTypes$ = this.checkoutPaymentService.getCardTypes().pipe(
      tap((cardTypes) => {
        if (Object.keys(cardTypes).length === 0) {
          this.checkoutPaymentService.loadSupportedCardTypes();
        }
      })
    );

    this.loading$ = this.checkoutPaymentService.getSetPaymentDetailsResultProcess();

    this.expiryMonthSelect.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => this.expiryMonthIn.setValue(value, {emitEvent: false}));

    this.expiryYearSelect.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => this.expiryYearIn.setValue(value.toString().slice(-2), {emitEvent: false}));

    this.paymentMethodService.isGoNextTriggered$
      .pipe(
        filter(isTriggered => isTriggered),
        takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.next();
      });
  }

  expMonthAndYear(): void {
    const year = new Date().getFullYear();

    for (let i = 0; i < 10; i++) {
      this.years.push(year + i);
    }

    for (let j = 1; j <= 12; j++) {
      if (j < 10) {
        this.months.push(`0${j}`);
      } else {
        this.months.push(j.toString());
      }
    }
  }

  toggleDefaultPaymentMethod(): void {
    this.paymentForm.value.defaultPayment = !this.paymentForm.value
      .defaultPayment;
  }

  close(): void {
    this.closeForm.emit();
  }

  back(): void {
    this.goBack.emit();
  }

  next(): void {
    if (this.paymentForm.valid) {
      // Save after billing is saved or unrequired to avoid send form and display loading
      this.paymentMethodService.isValidBillingForm$
        .pipe(
          filter(isValidBilling => isBoolean(isValidBilling)), // Filter only null values
          distinctUntilChanged(),
          takeUntil(this.unsubscribe$),
        )
        .subscribe((isValidBilling: boolean) => {
          if (isValidBilling) {
            // If billing is valid (or not required)
            this.loadOpenPay();
          } else {
            // If billing is invalid, boolean value in CC is necessary to stop loading
            this.paymentMethodService.setIsCCFormValid(true);
          }
        });
    } else {
      this.paymentMethodService.setIsCCFormValid(false);
      this.paymentForm.markAllAsTouched();
      this.changeDetector.detectChanges();
    }
  }

  loadOpenPay(): void {
    const formElement = this.elementRef.nativeElement.querySelector('form');
    OpenPay.token.extractFormAndCreate(
      formElement,
      (response: any) => {
        this.addOpenpayPaymentDetails(response);
        // setIsCCFormValid === true, in @effect CREATE_PAYMENT_DETAILS_SUCCESS
      },
      (error: any) => {
        this.paymentMethodService.setIsCCFormValid(false);
        this.globalMessageService.add({key: 'paymentForm.genericPaymentError'}, GlobalMessageType.MSG_TYPE_ERROR);
      }
    );
  }

  addOpenpayPaymentDetails(response: any): void {
    this.setPaymentDetails.emit({
      paymentDetails: this.fillOpenpayPaymentDetails(response.data)
    });
  }

  fillOpenpayPaymentDetails(data: any): MakaPaymentDetails {
    return {
      openPayTokenId: data.id,
      openPayDeviceId: this.openPayDeviceId,
      accountHolderName: data.card.holder_name,
      cardType: {code: data.card.brand},
      cardNumber: data.card.card_number,
      expiryMonth: data.card.expiration_month,
      expiryYear: this.paymentForm.get('expiryYear').value,
      defaultPayment: this.paymentForm.value.defaultPayment
    };
  }

  private setupOpenPay(): void {
    this.envConfigSubscription = this.makaEnvironmentService.getEnvironmentConfig()
      .subscribe((envConfig: any) => {
        OpenPay.setId(envConfig.openpayConfig.merchantId);
        OpenPay.setApiKey(envConfig.openpayConfig.apiKey);
        OpenPay.setSandboxMode(envConfig.openpayConfig.sandboxMode);
        this.openPayReady = true;
        this.openPayDeviceId = OpenPay.deviceData.setup('paymentDetailsForm', 'openpay_device_id');
        this.expMonthAndYear();
        this.changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.makaAddressVerifySub) {
      this.makaAddressVerifySub.unsubscribe();
    }
    if (this.envConfigSubscription) {
      this.envConfigSubscription.unsubscribe();
    }
    this.openpayService.removeScripts(this.renderer2);
    this.openPayReady = false;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
