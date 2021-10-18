import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';

import { MakaAnimatedTileComponent } from './maka-animated-tile.component';
import { MakaTextSpinnerModule } from '../../misc/text-spinner/maka-text-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MakaTextSpinnerModule
  ],
  declarations: [MakaAnimatedTileComponent],
  exports: [MakaAnimatedTileComponent],
  entryComponents: [MakaAnimatedTileComponent]
})
export class MakaAnimatedTileModule { }
