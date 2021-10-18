import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  provideDefaultConfig,
  CmsConfig,
  I18nModule
} from '@spartacus/core';

import { MakaTextSpinnerComponent } from './maka-text-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        TextSpinnerComponent: {
          component: MakaTextSpinnerComponent,
        }
      }
    } as CmsConfig)
  ],
  declarations: [MakaTextSpinnerComponent],
  exports: [MakaTextSpinnerComponent],
  entryComponents: [MakaTextSpinnerComponent]
})
export class MakaTextSpinnerModule { }
