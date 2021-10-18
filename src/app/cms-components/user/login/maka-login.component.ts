import { Component, OnInit } from '@angular/core';
import { AuthService, UserService } from '@spartacus/core';
import { LoginComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MakaHeaderAnimationService } from '../../navigation/header-animation/maka-header-animation.service';
import { MakaBaseSiteService } from '../../../shared/services/maka-base-site/maka-base-site.service';

@Component({
  selector: 'app-maka-login',
  templateUrl: './maka-login.component.html'
})
export class MakaLoginComponent extends LoginComponent implements OnInit {
  baseSite$: Observable<string>;
  openedMenu$ = this.makaHeaderAnimationService.myAccountMenuOpened$;
  inAnimationTransition = false;

  constructor(
    auth: AuthService,
    userService: UserService,
    private makaHeaderAnimationService: MakaHeaderAnimationService,
    private makaBaseSiteService: MakaBaseSiteService
  ) {
    super(auth, userService);
  }

  toggleNavigation() {
    if (!this.inAnimationTransition) {
      this.inAnimationTransition = true;
      this.makaHeaderAnimationService.toggleMyAccountMenu(false, () => {
        this.inAnimationTransition = false;
      });
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.baseSite$ = this.makaBaseSiteService.getBaseSiteData().pipe(
      map((baseSite) => {
        return baseSite.uid;
      })
    );
  }
}
