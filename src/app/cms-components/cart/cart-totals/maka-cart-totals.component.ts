import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CartTotalsComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-cart-totals',
  templateUrl: './maka-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaCartTotalsComponent extends CartTotalsComponent {}
