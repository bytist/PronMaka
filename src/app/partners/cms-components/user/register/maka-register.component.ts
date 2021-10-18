import { Component, OnDestroy } from '@angular/core';
import {
  RoutingService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaPartner } from '../../../../core/models/maka-user.model';


@Component({
  selector: 'app-maka-partner-register',
  templateUrl: './maka-register.component.html'
})
export class MakaPartnerRegisterComponent implements OnDestroy {

  unsubscribe$ = new Subject<void>();

  constructor(
    protected makaAssociateService: MakaAssociateService,
    protected globalMessageService: GlobalMessageService,
    protected router: RoutingService
  ) {}

  submitForm(partner: MakaPartner): void {
    this.registerUser(partner)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.router.go('login');
      this.globalMessageService.add(
        { key: 'register.postRegisterMessage' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });
  }

  registerUser(partner: MakaPartner) {
    return this.makaAssociateService.register(partner);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
