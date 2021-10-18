import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModule } from '@spartacus/storefront';
import {
  provideDefaultConfig,
  CmsConfig
} from '@spartacus/core';

import { MakaBannerComponent } from './maka-banner.component';

@NgModule({
  imports: [
    CommonModule,
    MediaModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaBannerComponent: {
          component: MakaBannerComponent,
          disableSSR: false
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaBannerComponent],
  exports: [MakaBannerComponent],
  entryComponents: [MakaBannerComponent]
})
export class MakaBannerModule { }
