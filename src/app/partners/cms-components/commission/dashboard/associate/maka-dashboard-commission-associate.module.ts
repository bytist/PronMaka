import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  UrlModule,
  I18nModule,
} from '@spartacus/core';

import { MakaDashboardCommissionAssociateComponent } from './maka-dashboard-commission-associate.component';

@NgModule({
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    RouterModule
  ],
  declarations: [MakaDashboardCommissionAssociateComponent],
  exports: [MakaDashboardCommissionAssociateComponent],
  entryComponents: [MakaDashboardCommissionAssociateComponent]
})
export class MakaDashboardCommissionAssociateModule { }
