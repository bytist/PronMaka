import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakaTextBannerComponent } from './maka-text-banner.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [MakaTextBannerComponent],
  exports: [MakaTextBannerComponent],
  entryComponents: [MakaTextBannerComponent]
})
export class MakaTextBannerModule { }
