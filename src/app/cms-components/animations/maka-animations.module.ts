import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';

import { MakaPlateModule } from './maka-plate/maka-plate.module';
import { MakaProductJourneyModule } from './maka-product-journey/maka-product-journey.module';
import { MakaAnimatedTileModule } from './maka-animated-tile/maka-animated-tile.module';

@NgModule({
  imports: [
    I18nModule,
    MakaPlateModule,
    MakaProductJourneyModule,
    MakaAnimatedTileModule
  ],
  exports: [
    MakaPlateModule,
    MakaProductJourneyModule,
    MakaAnimatedTileModule
  ],
})
export class MakaAnimationsModule { }
