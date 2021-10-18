import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';

import { MakaDashboardCommissionComponent } from './maka-dashboard-commission.component';
import { MakaDashboardCommissionAssociateModule } from './associate/maka-dashboard-commission-associate.module';
import { MakaDashboardCommissionLevelModule } from './commission-level/maka-dashboard-commission-level.module';
import { MakaSpinnerModule } from '../../../../cms-components/misc/maka-spinner/maka-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MakaSpinnerModule,
    MakaDashboardCommissionAssociateModule,
    MakaDashboardCommissionLevelModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CommissionLevelComponent: {
          component: MakaDashboardCommissionComponent,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaDashboardCommissionComponent],
  exports: [MakaDashboardCommissionComponent],
  entryComponents: [MakaDashboardCommissionComponent]
})
export class MakaDashboardCommissionModule { }
