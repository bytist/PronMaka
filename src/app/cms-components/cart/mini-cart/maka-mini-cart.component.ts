import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MiniCartComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-mini-cart',
  templateUrl: './maka-mini-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaMiniCartComponent extends MiniCartComponent {
}
