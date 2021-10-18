import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideDefaultConfig,
  CmsConfig,
  I18nModule
} from '@spartacus/core';

import { MakaPlateComponent } from './maka-plate.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaPlateBanner: {
          component: MakaPlateComponent,
          disableSSR: false
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaPlateComponent],
  exports: [MakaPlateComponent],
  entryComponents: [MakaPlateComponent]
})
export class MakaPlateModule { }
