import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  BaseOption,
  Product,
  RoutingService
} from '@spartacus/core';

import { MakaVariantQualifier, MakaVariantOptionQualifier } from '../../../../core/models';

@Component({
  selector: 'app-maka-variant-weight-selector',
  templateUrl: './maka-variant-weight-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaVariantWeightSelectorComponent implements OnInit {
  constructor(private routingService: RoutingService) {}

  @Input()
  product: Product;

  @Input()
  variants: BaseOption;

  selectedCode: string;

  ngOnInit() {
    this.selectedCode = this.variants.selected.code;
  }

  changeWeight(code: string, name: string): void {
    this.selectedCode = code;
    if (code) {
      this.routingService.go({
        cxRoute: 'product',
        params: { code, name },
      });
    }
    return null;
  }

  getVariantOptionValue(qualifiers: MakaVariantOptionQualifier[]) {
    const obj = qualifiers.find((q) => q.qualifier.toString() === MakaVariantQualifier.WEIGHT.toString());
    return obj ? (obj.value.split('.0').join('')) : '';
  }
}
