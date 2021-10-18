import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModule } from '@spartacus/storefront';
import {
  provideDefaultConfig,
  CmsConfig
} from '@spartacus/core';

import { MakaVideoComponent } from './maka-video.component';


@NgModule({
  imports: [
    CommonModule,
    MediaModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaVideoComponent: {
          component: MakaVideoComponent,
          disableSSR: false
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaVideoComponent],
  exports: [MakaVideoComponent],
  entryComponents: [MakaVideoComponent]
})
export class MakaVideoModule { }
