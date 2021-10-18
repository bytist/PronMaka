import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  UrlModule,
  I18nModule,
} from '@spartacus/core';

import { MakaDashboardCommissionLevelComponent } from './maka-dashboard-commission-level.component';
import { MakaSpinnerModule } from '../../../../../cms-components/misc/maka-spinner/maka-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    MakaSpinnerModule
  ],
  declarations: [MakaDashboardCommissionLevelComponent],
  exports: [MakaDashboardCommissionLevelComponent],
  entryComponents: [MakaDashboardCommissionLevelComponent]
})
export class MakaDashboardCommissionLevelModule { }
