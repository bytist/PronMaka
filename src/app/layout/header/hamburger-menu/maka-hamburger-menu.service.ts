import { Injectable,  PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HamburgerMenuService } from '@spartacus/storefront';

import {
  MakaHeaderAnimationService
} from '../../../cms-components/navigation/header-animation/maka-header-animation.service';

@Injectable({
  providedIn: 'root',
})
export class MakaHamburgerMenuService extends HamburgerMenuService {

  constructor(
    router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private makaHeaderAnimationService: MakaHeaderAnimationService
  ) {
    super(router);
    makaHeaderAnimationService.navMenuOpened$.subscribe(navExpanded => {
      this.isExpanded.next(navExpanded);
    });

  }

  /**
   * toggles the expand state of the hamburger menu
   */
  toggle(forceCollapse?: boolean): void {
    if (isPlatformBrowser((this.platformId))) {
      if (forceCollapse) {
        this.isExpanded.next(false);
        this.makaHeaderAnimationService.toggleNavigationMenu(true);
      } else {
        this.isExpanded.next(!this.isExpanded.value);
        this.makaHeaderAnimationService.toggleNavigationMenu();
      }
    }

  }
}
