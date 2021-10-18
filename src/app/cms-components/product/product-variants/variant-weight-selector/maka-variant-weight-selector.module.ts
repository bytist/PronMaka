import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UrlModule, I18nModule } from '@spartacus/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

import { MakaVariantWeightSelectorComponent } from './maka-variant-weight-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    NgSelectModule
  ],
  declarations: [ MakaVariantWeightSelectorComponent ],
  entryComponents: [ MakaVariantWeightSelectorComponent ],
  exports: [ MakaVariantWeightSelectorComponent ],
})
export class MakaVariantWeightSelectorModule {}
