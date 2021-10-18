import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModule } from '@spartacus/storefront';
import {
  provideDefaultConfig,
  CmsConfig
} from '@spartacus/core';

import { MakaTitleComponent } from './maka-title.component';

@NgModule({
  imports: [
    CommonModule,
    MediaModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaTitleComponent: {
          component: MakaTitleComponent,
          disableSSR: false
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaTitleComponent],
  exports: [MakaTitleComponent],
  entryComponents: [MakaTitleComponent]
})
export class MakaTitleModule { }
