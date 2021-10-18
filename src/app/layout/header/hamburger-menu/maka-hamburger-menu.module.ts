import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HamburgerMenuService } from '@spartacus/storefront';

import { MakaHamburgerMenuService } from './maka-hamburger-menu.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: HamburgerMenuService,
      useClass: MakaHamburgerMenuService
    }
  ],
})
export class MakaHamburgerMenuModule {}
