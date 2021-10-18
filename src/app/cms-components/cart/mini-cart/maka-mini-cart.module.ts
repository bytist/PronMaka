import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule
} from '@spartacus/core';

import { MakaMiniCartComponent } from './maka-mini-cart.component';

@NgModule({
  imports: [CommonModule, RouterModule, UrlModule, I18nModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MiniCartComponent: {
          component: MakaMiniCartComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaMiniCartComponent],
  exports: [MakaMiniCartComponent],
  entryComponents: [MakaMiniCartComponent],
})
export class MakaMiniCartModule {}
