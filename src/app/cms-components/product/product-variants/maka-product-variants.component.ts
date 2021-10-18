import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { CurrentProductService, ProductVariantsComponent } from '@spartacus/storefront';

import { MakaVariantType } from '../../../core/models';

@Component({
  selector: 'app-maka-product-variants',
  templateUrl: './maka-product-variants.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaProductVariantsComponent extends ProductVariantsComponent implements OnInit {

  constructor(currentProductService: CurrentProductService) {
    super(currentProductService);
  }

  makaVariantType = MakaVariantType;

  ngOnInit(): void {
    super.ngOnInit();
  }
}
