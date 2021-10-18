import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {
  ActiveCartService,
  AuthRedirectService,
  AuthService,
  RoutingService,
  User,
  UserToken,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CheckoutConfigService } from '@spartacus/storefront';


@Injectable({
  providedIn: 'root',
})
export class MakaCheckoutAuthGuard implements CanActivate {
  constructor(
    protected routingService: RoutingService,
    protected authService: AuthService,
    protected authRedirectService: AuthRedirectService,
    protected checkoutConfigService: CheckoutConfigService,
    protected activeCartService: ActiveCartService
  ) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.authService.getUserToken(),
      this.activeCartService.getAssignedUser(),
      this.activeCartService.isStable(), // isStable() is necessary to avoid display login on reload page
    ]).pipe(
      filter(([, , isStable]) => !!isStable),
      map(([token, user, stable]: [UserToken, User, boolean]) => {
        if (!token.access_token) {
          if (this.activeCartService.isGuestCart()) {
            return Boolean(user);
          }

          this.authRedirectService.reportAuthGuard();
          if (this.checkoutConfigService.isGuestCheckout()) {
            this.routingService.go({ cxRoute: 'checkoutLogin' });
          } else {
            this.routingService.go({ cxRoute: 'login' });
          }
        }

        return !!token.access_token;
      })
    );
  }
}
