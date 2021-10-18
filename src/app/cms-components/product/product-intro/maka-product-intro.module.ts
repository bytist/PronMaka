import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { StarRatingModule } from '@spartacus/storefront';

import { MakaProductIntroComponent } from './maka-product-intro.component';

@NgModule({
  imports: [CommonModule, I18nModule, StarRatingModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductIntroComponent: {
          component: MakaProductIntroComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaProductIntroComponent],
  exports: [MakaProductIntroComponent],
  entryComponents: [MakaProductIntroComponent],
})
export class MakaProductIntroModule {}
