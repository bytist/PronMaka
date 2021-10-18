import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderConfirmationOverviewComponent, Card } from '@spartacus/storefront';
import { TranslationService } from '@spartacus/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { MakaAddress, MakaOrder, PaymentMode } from 'src/app/core/models';
import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

@Component({
  selector: 'app-maka-order-confirmation-overview',
  templateUrl: './maka-order-confirmation-overview.component.html',
})
export class MakaOrderConfirmationOverviewComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  orderConfirmation$: Observable<MakaOrder> = this.checkoutService.getOrderDetails().pipe(takeUntil(this.unsubscribe$));

  constructor(protected checkoutService: MakaCheckoutService, protected translationService: TranslationService) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
