import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MakaShowcaseComponent } from './maka-showcase.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    BrowserAnimationsModule
  ],
  declarations: [MakaShowcaseComponent],
  exports: [MakaShowcaseComponent],
  entryComponents: [MakaShowcaseComponent]
})
export class MakaShowcaseModule { }
