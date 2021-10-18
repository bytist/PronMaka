import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {
  ActiveCartService,
  AuthService,
  RoutingService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MakaNotCheckoutAuthGuard implements CanActivate {
  constructor(
    protected routingService: RoutingService,
    protected authService: AuthService,
    protected activeCartService: ActiveCartService
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUserToken().pipe(
      map((token) => {
        if (token.access_token) {
          this.routingService.go({ cxRoute: 'checkout' });
        } else if (this.activeCartService.isGuestCart()) {
          this.routingService.go({ cxRoute: 'cart' });
          return false;
        }
        return !token.access_token;
      })
    );
  }
}
