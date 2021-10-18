import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ProductFacetNavigationComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-product-facet-navigation',
  templateUrl: './maka-product-facet-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaProductFacetNavigationComponent extends ProductFacetNavigationComponent {}
