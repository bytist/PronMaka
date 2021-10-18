import { NgModule } from '@angular/core';

import { MakaTitleModule } from './maka-title/maka-title.module';
import { MakaTextSpinnerModule } from './text-spinner/maka-text-spinner.module';
import { MakaTextBannerModule } from './maka-text-banner/maka-text-banner.module';
import { MakaVideoModule } from './maka-video/maka-video.module';
import { MakaBannerModule } from './maka-banner/maka-banner.module';
import { MakaSpinnerModule } from './maka-spinner/maka-spinner.module';
import { MakaTabParagraphContainerModule } from './maka-tab-paragraph-container/maka-tab-paragraph-container.module';

@NgModule({
  imports: [
    MakaTextSpinnerModule,
    MakaTitleModule,
    MakaVideoModule,
    MakaTextBannerModule,
    MakaBannerModule,
    MakaSpinnerModule,
  ],
  exports: [
    MakaTextSpinnerModule,
    MakaTitleModule,
    MakaVideoModule,
    MakaTextBannerModule,
    MakaBannerModule,
    MakaSpinnerModule,
    MakaTabParagraphContainerModule
  ],
})
export class MakaMiscModule {}
