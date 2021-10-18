import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, provideDefaultConfig, UrlModule, I18nModule } from '@spartacus/core';
import { CarouselModule, MediaModule, ProductListModule } from '@spartacus/storefront';

import { MakaProductReferencesComponent } from './maka-product-references.component';
import { MakaSectionTitleModule } from '../../../misc/maka-section-title/maka-section-title.module';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule,
    MediaModule,
    RouterModule,
    UrlModule,
    ProductListModule,
    MakaSectionTitleModule,
    I18nModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductReferencesComponent: {
          component: MakaProductReferencesComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaProductReferencesComponent],
  entryComponents: [MakaProductReferencesComponent],
  exports: [MakaProductReferencesComponent],
})
export class MakaProductReferencesModule {}
