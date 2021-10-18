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

/**
 * Guard for component rendered by 3d secure
 */
@Injectable({
  providedIn: 'root',
})
export class MakaPlacingOrderAuthGuard implements CanActivate {
  constructor(
    protected routingService: RoutingService,
    protected authService: AuthService,
    protected authRedirectService: AuthRedirectService,
    protected checkoutConfigService: CheckoutConfigService,
    protected activeCartService: ActiveCartService,
  ) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.authService.getUserToken(),
      this.activeCartService.getAssignedUser(),
      this.activeCartService.isStable(),
    ]).pipe(
      filter(([, , isStable]) => !!isStable),
      map(([token, user, stable]: [UserToken, User, boolean]) => {
        if (!token.access_token) {
          if (this.activeCartService.isGuestCart()) {
            return Boolean(user);
          }

          this.authRedirectService.reportAuthGuard();
          this.routingService.go({ cxRoute: 'login' });
        }

        return !!token.access_token;
      })
    );
  }
}
