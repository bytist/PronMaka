import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {
  RoutingService,
  UserService,
  GlobalMessageService,
  GlobalMessageType,
  RouterState,
  AuthRedirectService
} from '@spartacus/core';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { MakaUser } from '../../../core/models/maka-user.model';
import { MakaBaseSiteService } from '../../../shared/services/maka-base-site/maka-base-site.service';
import { MakaBaseSites } from '../../models/maka-site.model';

@Injectable({
  providedIn: 'root',
})
export class MakaAccessSiteGuard implements CanActivate {

  constructor(
    protected routingService: RoutingService,
    protected userService: UserService,
    protected globalMessageService: GlobalMessageService,
    protected makaBaseSiteService: MakaBaseSiteService,
    protected authRedirectService: AuthRedirectService
  ) {}

  isPublicPage(routerState) {
    // login, register and forgot password page (they are all preceded by '/login')
    return Boolean(routerState.nextState.url.match(/login/));
  }

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.userService.get(),
      this.makaBaseSiteService.getActive(),
      this.routingService.getRouterState()
    ])
      .pipe(
        take(1),
        map(([user, baseSitesData, routerState]: [MakaUser, MakaBaseSites, RouterState ]) => {
          let canAccessSite = true;
          if (routerState.nextState.url.match(/maka-partners/)) {

            if (!user.uid) {
              if (this.isPublicPage(routerState)) {
                canAccessSite = true;
              } else {
                // if user not logged in, and not public page, redirect to login
                this.authRedirectService.reportAuthGuard();
                this.routingService.go(['login']);
                canAccessSite = false;
              }
            } else if (!user.isAssociate) {
              // if user logged in and not a partner, deny access
              this.globalMessageService.add({ key: 'partner.partnerRedirectClient' }, GlobalMessageType.MSG_TYPE_ERROR);
              const storeSite = baseSitesData.baseSites[0];
              this.routingService.goByUrl(`/${storeSite.uid}`);
              canAccessSite = false;
            }
          }
          return canAccessSite;
        })
      );
  }
}
