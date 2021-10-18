import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '@spartacus/core';

import {
  AssociateDashboardActualCommissionLevel,
  AssociateDashboardNextCommissionLevel
} from '../../../../../core/models/maka-associate-dashboard-commission.model';
import { MakaAssociateService } from '../../../../../shared/services/maka-associate/maka-associate.service';
import { MakaGraphData } from '../../../../../core/models/maka-misc.model';
import { MakaUsersPerDayList } from '../../../../../core/models/maka-user.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-maka-dashboard-commission-level',
  templateUrl: './maka-dashboard-commission-level.component.html'
})
export class MakaDashboardCommissionLevelComponent implements OnInit, OnDestroy {
  @Input() actualCommissionLevel: AssociateDashboardActualCommissionLevel;
  @Input() nextCommissionLevel: AssociateDashboardNextCommissionLevel;
  @Input() referMoreIncentiveMessageTitle: string;
  @Input() referMoreIncentiveMessageSubtitle: string;

  unsubscribe$ = new Subject<void>();
  stats$ = this.makaAssociateService.getDashboardStats();

  // graph options
  referenceLines: {name: string, value: string}[];
  colorScheme = {
    domain: ['#4863a4']// $maka-blue
  };
  graphData: MakaGraphData[] = [
    {
      name: '',
      series: []
    }
  ];
  graphReady = false;
  yAxisMargin = environment.dashboardConfig.yAxisMargin;
  minYAxis = 40;

  constructor(
    protected makaAssociateService: MakaAssociateService,
    protected translationService: TranslationService,
    protected changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    combineLatest([
      this.stats$,
      this.translationService.translate('partner.commissions.clients')
    ])
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(([data, message]: [MakaUsersPerDayList, string]) => {
      if (data.commissionLevels) {
        this.referenceLines = data.commissionLevels.map(commissionLevel => {
          return {
            name: commissionLevel.rate,
            value: commissionLevel.minActiveClientsCondition
          };
        });

        // Make the default minYAxis to be the top commission level value (with a 10 units margin)
        this.minYAxis = Math.max.apply(Math, data.commissionLevels.map((item) => item.minActiveClientsCondition )) + this.yAxisMargin;
      }

      if (data.usersPerDayList) {
        this.graphData[0].name = message;
        /* usersPerDayList contains the accumulate of clients per each day of month,
         so taking the number of clients each 7, 14, 21, and end of month is enough for
         the graph's data.
         */
        data.usersPerDayList
        .filter((item, index) => {
          return (item.dayOfMonth === 7 || item.dayOfMonth === 14 || item.dayOfMonth === 21 || index === data.usersPerDayList.length - 1);
        })
        .map((item, index) => {
          // if there is a value that is greater than current minYAxis, then this is the new minYAxis (with a 10 units margin)
          if (item.users > this.minYAxis) {
            this.minYAxis = item.users + this.yAxisMargin;
          }
          this.graphData[0].series.push({ name: (index + 1).toString(), value: item.users });
        });

        if (this.graphData[0].series.length > 0) {
          this.graphData[0].series.unshift({ name: '0', value: 0 });
        }
      }

      this.graphReady = true;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
