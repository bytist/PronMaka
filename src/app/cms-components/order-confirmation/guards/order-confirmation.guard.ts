import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SemanticPathService } from '@spartacus/core';

import { MakaCheckoutService } from '../../../core/checkout/facade/maka-checkout.service';

@Injectable({
  providedIn: 'root',
})
export class OrderConfirmationGuard implements CanActivate {
  constructor(
    private checkoutService: MakaCheckoutService,
    private router: Router,
    private semanticPathService: SemanticPathService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkoutService.getOrderDetails().pipe(
      map((order) => {
        if (order && Object.keys(order).length !== 0) {
          return true;
        } else {
          return this.router.parseUrl(this.semanticPathService.get('orders'));
        }
      })
    );
  }
}
