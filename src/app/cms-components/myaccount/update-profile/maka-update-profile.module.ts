import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  FormErrorsModule,
  SpinnerModule
} from '@spartacus/storefront';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig
} from '@spartacus/core';

import { MakaUpdateProfileComponent } from './maka-update-profile.component';
import { MakaUpdateProfileFormComponent } from './update-profile-form/maka-update-profile-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    I18nModule,
    FormErrorsModule
  ],
  providers:
    [
      provideDefaultConfig
      ({
        cmsComponents: {
          UpdateProfileComponent: {
            component: MakaUpdateProfileComponent,
            guards: [ AuthGuard ]
          }
        }
      } as CmsConfig)
    ],
  declarations: [
    MakaUpdateProfileComponent,
    MakaUpdateProfileFormComponent
  ],
  exports: [
    MakaUpdateProfileComponent,
    MakaUpdateProfileFormComponent
  ],
  entryComponents: [ MakaUpdateProfileComponent ]
})
export class MakaUpdateProfileModule { }
