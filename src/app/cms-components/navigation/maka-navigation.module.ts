import { NgModule } from '@angular/core';

import { MakaFooterNavigationModule } from './footer-navigation/maka-footer-navigation.module';

@NgModule({
  imports: [
    MakaFooterNavigationModule,
  ],
  exports: [
    MakaFooterNavigationModule
  ],
})
export class MakaNavigationModule { }
