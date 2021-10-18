import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule, provideDefaultConfig,
  UrlModule
} from '@spartacus/core';
import {
  ProductVariantGuard,
  VariantColorSelectorModule,
  VariantSizeSelectorModule,
  VariantStyleIconsComponent,
  VariantStyleIconsModule,
  VariantStyleSelectorModule
} from '@spartacus/storefront';
import { MakaVariantWeightSelectorModule } from './variant-weight-selector/maka-variant-weight-selector.module';
import { MakaProductVariantsComponent } from './maka-product-variants.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    VariantStyleSelectorModule,
    VariantSizeSelectorModule,
    VariantColorSelectorModule,
    VariantStyleIconsModule,
    MakaVariantWeightSelectorModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductVariantSelectorComponent: {
          component: MakaProductVariantsComponent,
          guards: [ ProductVariantGuard ],
        },
      },
    } as CmsConfig),
  ],
  declarations: [ MakaProductVariantsComponent ],
  entryComponents: [ MakaProductVariantsComponent ],
  exports: [ VariantStyleIconsComponent ]
})
export class MakaProductVariantsModule { }
