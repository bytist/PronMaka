import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductReferencesComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-product-references',
  templateUrl: './maka-product-references.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaProductReferencesComponent extends ProductReferencesComponent {}
