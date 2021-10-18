import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActiveCartService, Cart, CmsService } from '@spartacus/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-maka-checkout-order-summary',
  templateUrl: './maka-checkout-order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaCheckoutOrderSummaryComponent implements OnInit, OnDestroy {
  cart$: Observable<Cart> = this.activeCartService.getActive();
  isCheckoutOrderReviewPage$ = new BehaviorSubject(false);
  private unsubscribe$ = new Subject<void>();

  constructor(
    protected activeCartService: ActiveCartService,
    protected cms: CmsService
  ) {}

  ngOnInit(): void {
    this.cms.getCurrentPage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pageMetaData) => {
        // display place order button just for the checkoutReviewOrder page
        //  as this component is displayed in multiple checkout screens
        this.isCheckoutOrderReviewPage$.next(pageMetaData && pageMetaData.pageId && pageMetaData.pageId === 'checkoutReviewOrder');
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
