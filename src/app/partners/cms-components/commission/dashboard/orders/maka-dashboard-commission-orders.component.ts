import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject
} from 'rxjs';
import {
  switchMap,
  takeUntil
} from 'rxjs/operators';

import { MakaAssociateService } from '../../../../../shared/services/maka-associate/maka-associate.service';
import { AssociateDashboardCommissionOrders } from '../../../../../core/models/maka-associate-dashboard-commission-orders.model';

@Component({
  selector: 'app-maka-dashboard-commission-orders',
  templateUrl: './maka-dashboard-commission-orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaDashboardCommissionOrdersComponent implements OnInit, OnDestroy {

  referralOrders$: Observable<AssociateDashboardCommissionOrders>;
  nextPage$ = new BehaviorSubject<number>(0);
  unsubscribe$ = new Subject<void>();

  constructor(private makaAssociateService: MakaAssociateService) { }

  ngOnInit(): void {
    this.referralOrders$ =
      combineLatest([
        this.nextPage$,
      ])
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(([page]) => this.makaAssociateService.searchDashboardAssociateReferralOrders(page))
      );
  }

  pageChange(page: number) {
    this.nextPage$.next(page);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
