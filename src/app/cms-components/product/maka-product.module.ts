import { NgModule } from '@angular/core';

import { MakaProductVariantsModule } from './product-variants/maka-product-variants.module';
import { MakaProductReferencesModule } from './carousel/product-references/maka-product-references.module';
import { MakaProductIntroModule } from './product-intro/maka-product-intro.module';
import { MakaProductReviewsModule } from './product-tabs/product-reviews/maka-product-reviews.module';
import { MakaProductFacetNavigationModule } from './product-facet-navigation/maka-product-facet-navigation.module';
import { MakaProductAttributesModule } from './product-tabs/product-attributes/maka-product-attributes.module';


@NgModule({
  imports: [
    MakaProductVariantsModule,
    MakaProductReferencesModule,
    MakaProductIntroModule,
    MakaProductReviewsModule,
    MakaProductFacetNavigationModule,
    MakaProductAttributesModule
  ],
  exports: [
    MakaProductVariantsModule,
    MakaProductReferencesModule,
    MakaProductIntroModule,
    MakaProductReviewsModule,
    MakaProductFacetNavigationModule,
    MakaProductAttributesModule
  ]
})
export class MakaProductModule { }
