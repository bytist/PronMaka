import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@spartacus/core';
import { IconModule, KeyboardFocusModule } from '@spartacus/storefront';

import { MakaActiveFacetsComponent } from './maka-active-facets.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
  ],
  declarations: [MakaActiveFacetsComponent],
  exports: [MakaActiveFacetsComponent],
})
export class MakaActiveFacetsModule {}
