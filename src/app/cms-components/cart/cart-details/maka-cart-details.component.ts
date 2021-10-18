import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartDetailsComponent, PromotionService } from '@spartacus/storefront';
import { Subject, combineLatest, of, Observable } from 'rxjs';
import { takeUntil, switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { ActiveCartService, SelectiveCartService, AuthService, RoutingService } from '@spartacus/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  MakaRecurrenceConfiguration,
  MakaCart
} from 'src/app/core/models/maka-cart.model';
import { MakaActiveCartService } from 'src/app/shared/services/maka-cart/maka-active-cart.service';
import { MakaBaseSiteService } from 'src/app/shared/services/maka-base-site/maka-base-site.service';

@Component({
  selector: 'app-maka-cart-details',
  templateUrl: './maka-cart-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCartDetailsComponent extends CartDetailsComponent implements OnInit, OnDestroy {

  openPay3DSMin$: Observable<number>;
  recurrenceConfigurations: MakaRecurrenceConfiguration[];
  recurringOrderSelected: boolean;
  unsubscribe$ = new Subject<void>();

  recurringFrequencySelected: MakaRecurrenceConfiguration;

  constructor(
    protected activeCartService: ActiveCartService,
    protected promotionService: PromotionService,
    protected selectiveCartService: SelectiveCartService,
    protected authService: AuthService,
    protected routingService: RoutingService,
    protected makaCartService: MakaActiveCartService,
    protected makaBaseSiteService: MakaBaseSiteService,
    @Inject(PLATFORM_ID) private platformId: any
) {
    super(
      activeCartService,
      promotionService,
      selectiveCartService,
      authService,
      routingService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.openPay3DSMin$ = this.makaBaseSiteService
    .getBaseSiteData()
    .pipe(
      takeUntil(this.unsubscribe$),
      distinctUntilChanged(),
      map((baseSite) => baseSite.openPay3DSMin));

    this.cart$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(cart => {
        this.recurrenceConfigurations = this.getRecurrenceConfigurations(cart);
        this.recurringOrderSelected = this.isRecurringOrder(cart);

        if (this.recurringOrderSelected) {
          this.setRecurrenceConfiguration(cart);
        }

        /**
         * Needed to trigger footer animation on cart item removal (body height changes).
         * As cart item removal is ootb we cannot trigger scroll trigger refresh in the corresponding component, so
         * we execute it upon cart refresh.
         */
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => ScrollTrigger.refresh(), 1000);
        }
      });
  }

  toggleRecurringOrder(): void {
    this.recurringOrderSelected = !this.recurringOrderSelected;

    if (this.recurringOrderSelected) {
      this.updateRecurrenceConfiguration(this.recurrenceConfigurations[0]);
    } else {
      this.removeRecurrenceConfiguration();
    }
  }

  displayRecurringOrderOption(cart: MakaCart): boolean {
    return !MakaActiveCartService.isUserAnonymousOrGuest(cart);
  }

  isRecurringOrder(cart: MakaCart): boolean {
    return !!cart.recurrence;
  }

  getRecurrenceConfigurations(cart: MakaCart): MakaRecurrenceConfiguration[]{
    return cart.recurrenceConfigurations || [];
  }

  setRecurrenceConfiguration(cart: MakaCart) {
    this.recurringFrequencySelected = cart.recurrence;
  }

  updateRecurrenceConfiguration(config: MakaRecurrenceConfiguration) {
    combineLatest([
      this.activeCartService.getActiveCartId(),
      this.authService.getOccUserId(),
    ]).pipe(
      takeUntil(this.unsubscribe$),
      switchMap(([cartId, userId]) =>
      combineLatest([
        of(cartId),
        of(userId),
        this.makaCartService.addRecurrenceConfiguration(cartId, userId, config.code)
      ])),
      map(([cartId, userId]) => this.makaCartService.loadCart(userId, cartId))
    ).subscribe();
  }

  removeRecurrenceConfiguration() {
    combineLatest([
      this.activeCartService.getActiveCartId(),
      this.authService.getOccUserId(),
    ]).pipe(
      takeUntil(this.unsubscribe$),
      switchMap(([cartId, userId]) =>
        combineLatest([
          of(cartId),
          of(userId),
          this.makaCartService.removeRecurrenceConfiguration(cartId, userId).pipe(takeUntil(this.unsubscribe$))
        ])
      ),
      map(([cartId, userId]) => this.makaCartService.loadCart(userId, cartId))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
