import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';

import { MakaFacetListModule } from './facet-list/maka-facet-list.module';
import { MakaProductFacetNavigationComponent } from './maka-product-facet-navigation.component';
import { MakaActiveFacetsModule } from './active-facets/maka-active-facets.module';

@NgModule({
  imports: [
    CommonModule,
    MakaFacetListModule,
    MakaActiveFacetsModule,
    IconModule,
    I18nModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductRefinementComponent: {
          component: MakaProductFacetNavigationComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaProductFacetNavigationComponent],
  exports: [MakaProductFacetNavigationComponent],
})
export class MakaProductFacetNavigationModule {}
