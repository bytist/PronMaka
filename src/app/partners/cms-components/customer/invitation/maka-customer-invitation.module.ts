import { NgModule } from '@angular/core';
import { AuthGuard, CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorsModule } from '@spartacus/storefront';
import { CommonModule } from '@angular/common';

import { MakaCustomerInvitationComponent } from './maka-customer-invitation.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    CommonModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CustomerInvitationComponent: {
          component: MakaCustomerInvitationComponent,
          disableSSR: false,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCustomerInvitationComponent],
  exports: [MakaCustomerInvitationComponent],
  entryComponents: [MakaCustomerInvitationComponent]
})
export class MakaCustomerInvitationModule { }
