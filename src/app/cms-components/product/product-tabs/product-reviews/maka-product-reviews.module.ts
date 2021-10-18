import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule, FormErrorsModule } from '@spartacus/storefront';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';

import { MakaProductReviewsComponent } from './maka-product-reviews.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    I18nModule,
    StarRatingModule,
    FormErrorsModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductReviewsTabComponent: {
          component: MakaProductReviewsComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaProductReviewsComponent],
  entryComponents: [MakaProductReviewsComponent],
  exports: [MakaProductReviewsComponent],
})
export class MakaProductReviewsModule {}
