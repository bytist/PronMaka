import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { KeyboardFocusModule, IconModule, FacetModule } from '@spartacus/storefront';

import { MakaFacetListComponent } from './maka-facet-list.component';
import { MakaActiveFacetsModule } from '../active-facets/maka-active-facets.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    FacetModule,
    KeyboardFocusModule,
    MakaActiveFacetsModule,
  ],
  declarations: [MakaFacetListComponent],
  exports: [MakaFacetListComponent],
})
export class MakaFacetListModule {}
