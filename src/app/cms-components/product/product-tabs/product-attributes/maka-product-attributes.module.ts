import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig
} from '@spartacus/core';

import { MakaProductAttributesComponent } from './maka-product-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductSpecsTabComponent: {
          component: MakaProductAttributesComponent
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaProductAttributesComponent],
  entryComponents: [MakaProductAttributesComponent],
  exports: [MakaProductAttributesComponent]
})
export class MakaProductAttributesModule { }
