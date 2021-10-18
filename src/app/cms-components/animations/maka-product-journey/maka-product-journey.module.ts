import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideDefaultConfig,
  CmsConfig,
  I18nModule
} from '@spartacus/core';

import { MakaProductJourneyComponent } from './maka-product-journey.component';
import { MakaShowcaseModule } from '../../misc/maka-showcase/maka-showcase.module';
import { MakaAnimatedTileModule } from '../maka-animated-tile/maka-animated-tile.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MakaShowcaseModule,
    MakaAnimatedTileModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaProductJourney: {
          component: MakaProductJourneyComponent,
          disableSSR: false
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaProductJourneyComponent],
  exports: [MakaProductJourneyComponent],
  entryComponents: [MakaProductJourneyComponent]
})
export class MakaProductJourneyModule { }
