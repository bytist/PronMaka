import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { switchMap, tap, switchMapTo, takeUntil } from 'rxjs/operators';
import { RoutingService, TranslationService } from '@spartacus/core';

import { AssociateCommissionRecordHistoryPage } from '../../../../core/models/maka-associate-commission-record-history.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { Filter, MakaYearFilter } from '../../../../core/models/maka-filters.model';
import { AssociateCommissionRecord } from '../../../../core/models/maka-associate-commission-record.model';
import { MakaCommissionPaymentService } from '../payment/maka-commission-payment.service';


@Component({
  selector: 'app-maka-commission-history',
  templateUrl: './maka-commission-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCommissionHistoryComponent implements OnInit, OnDestroy {
  years: MakaYearFilter[] = [];
  nextPage = 0;
  selectedYear = '';
  getData$ = new BehaviorSubject<{ nextPage: number, year: string}>({ nextPage: this.nextPage, year: this.selectedYear });
  allYearsOption: MakaYearFilter;

  commissionRecordsHistoryPage$: Observable<AssociateCommissionRecordHistoryPage> =
    combineLatest([
      this.getData$,
      this.translationService.translate('partner.commissions.allYears')
    ])
    .pipe(
      switchMap(([data, message]) => {
        this.allYearsOption = { year: '', label: message.toString() };
        return this.associateService.getAssociateCommissionRecordsHistory(data.year, data.nextPage);
      }),
      tap(commissionRecord => {
        this.years = [this.allYearsOption].concat(this.getYearsFilter(commissionRecord.filters));
      })
    );

  commissionHistoryEvent$ = new BehaviorSubject(true);
  commissionRecordsHistoryPageWrapper$ =  this.commissionHistoryEvent$.pipe(
    switchMapTo(this.commissionRecordsHistoryPage$)
  );

  private unsubscribe$ = new Subject<void>();

  constructor(
    private associateService: MakaAssociateService,
    private routingService: RoutingService,
    private translationService: TranslationService,
    private makaCommissionPaymentService: MakaCommissionPaymentService
  ) {}

  ngOnInit() {
    this.makaCommissionPaymentService.sentToPayment$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sentToPayment) => {
      this.refreshData();
    });
  }

  goToCommissionRecordDetail(commission: AssociateCommissionRecord): void {
    this.routingService.go({
      cxRoute: 'commissionDetails',
      params: commission,
    });
  }

  pageChange(page: number) {
    this.nextPage = page;
    this.getData$.next({ nextPage: this.nextPage, year: this.selectedYear });
  }

  getYearsFilter(filters: Filter[]): MakaYearFilter[] {
    const yearFilters = filters.find(filter => filter.key === 'years')?.value;
    return (yearFilters) ? yearFilters.map((item) => {
      return { year: item, label: item };
    }) : [];
  }

  changeYear(yearFilter: MakaYearFilter): void {
    this.nextPage = 0;
    this.selectedYear = yearFilter.year;
    this.getData$.next({ nextPage: this.nextPage, year: this.selectedYear });
  }

  refreshData() {
    this.commissionHistoryEvent$.next(true);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
