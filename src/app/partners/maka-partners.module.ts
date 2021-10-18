import { NgModule } from '@angular/core';

import { MakaPartnerUpdateProfileModule } from './cms-components/myaccount/maka-update-profile.module';
import { MakaPartnerRegisterModule } from './cms-components/user/register/maka-register.module';
import { MakaCustomerInvitationModule } from './cms-components/customer/invitation/maka-customer-invitation.module';
import { MakaCommissionPaymentModule } from './cms-components/commission/payment/maka-commission-payment.module';
import { MakaCommissionHistoryModule } from './cms-components/commission/history/maka-commission-history.module';
import { MakaDashboardCommissionModule } from './cms-components/commission/dashboard/maka-dashboard-commission.module';
import { MakaDashboardCommissionAssociateModule } from './cms-components/commission/dashboard/associate/maka-dashboard-commission-associate.module';
import { MakaDashboardCommissionLevelModule } from './cms-components/commission/dashboard/commission-level/maka-dashboard-commission-level.module';
import { MakaDashboardCommissionOrdersModule } from './cms-components/commission/dashboard/orders/maka-dashboard-commission-orders.module';
import { MakaCommissionDetailModule } from './cms-components/commission/detail/maka-commission-detail.module';
import { MakaCommissionOrderTableModule } from './cms-components/commission/order/comission-order-table/maka-commission-order-table.module';

@NgModule({
  imports: [
    MakaPartnerUpdateProfileModule,
    MakaPartnerRegisterModule,
    MakaCustomerInvitationModule,
    MakaCommissionPaymentModule,
    MakaDashboardCommissionModule,
    MakaDashboardCommissionAssociateModule,
    MakaDashboardCommissionLevelModule,
    MakaDashboardCommissionOrdersModule,
    MakaCommissionDetailModule,
    MakaCommissionOrderTableModule
  ],
  exports: [
    MakaPartnerUpdateProfileModule,
    MakaPartnerRegisterModule,
    MakaCustomerInvitationModule,
    MakaCommissionPaymentModule,
    MakaCommissionHistoryModule,
    MakaDashboardCommissionModule,
    MakaDashboardCommissionAssociateModule,
    MakaDashboardCommissionLevelModule,
    MakaDashboardCommissionOrdersModule,
    MakaCommissionDetailModule,
    MakaCommissionOrderTableModule
  ]
})
export class MakaPartnerModule { }
