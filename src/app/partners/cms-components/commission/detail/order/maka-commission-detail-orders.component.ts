import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RoutingService } from '@spartacus/core';
import { AssociateDashboardCommissionOrders } from '../../../../../core/models/maka-associate-dashboard-commission-orders.model';
import { MakaAssociateService } from '../../../../../shared/services/maka-associate/maka-associate.service';

@Component({
  selector: 'app-maka-commission-detail-orders',
  templateUrl: './maka-commission-detail-orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCommissionDetailOrdersComponent implements OnInit {
  commissionOrdersPage$: Observable<AssociateDashboardCommissionOrders>;
  nextPage$ = new BehaviorSubject<number>(0);

  constructor(private associateService: MakaAssociateService,
              private routingService: RoutingService) {
  }

  ngOnInit(): void {
    this.commissionOrdersPage$ =
      combineLatest([
        this.nextPage$,
        this.routingService.getRouterState(),
      ]).pipe(
        switchMap(([page, routingData]) =>
          this.associateService.getAssociatesCommissionRecordOrders(routingData.state.params?.code, page))
      );
  }

  pageChange(page: number) {
    this.nextPage$.next(page);
  }
}
