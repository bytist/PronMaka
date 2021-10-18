import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RoutingService } from '@spartacus/core';

import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaPartner } from '../../../../core/models/maka-user.model';
import { AssociateCommissionRecord } from '../../../../core/models/maka-associate-commission-record.model';

@Component({
  selector: 'app-maka-commission-detail',
  templateUrl: './maka-commission-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCommissionDetailComponent implements OnInit {
  partner$: Observable<MakaPartner>;
  commissionRecord$: Observable<AssociateCommissionRecord>;

  constructor(
    private associateService: MakaAssociateService,
    private routingService: RoutingService) {
  }

  ngOnInit(): void {
    this.partner$ = this.associateService.getCurrentAssociate();
    this.commissionRecord$ = this.routingService
      .getRouterState()
      .pipe(
        map((routingData) => routingData.state.params?.code),
        switchMap((code) => this.associateService.getAssociatesCommissionRecord(code))
      );
  }
}
