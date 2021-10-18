import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalRef, ModalService } from '@spartacus/storefront';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MakaOrder } from '../../../../../core/models';
import { MakaCancelOrderRecurrenceModalComponent } from '../cancel-order-recurrence-modal/maka-cancel-order-recurrence-modal.component';
import { MakaOrderDetailsService } from '../../maka-order-details.service';
import { RecurrenceOrderStatus } from '../../../../../core/models/maka-cart.model';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-maka-order-detail-recurrent-order-details',
  templateUrl: './maka-order-detail-recurrent-order-details.component.html'
})
export class MakaOrderDetailRecurrentOrderDetailsComponent implements OnInit, OnDestroy {
  modalRef: ModalRef;
  order$ = new Subject<MakaOrder>();
  unsubscribe$ = new Subject<void>();

  constructor(private orderDetailsService: MakaOrderDetailsService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.orderDetailsService.getOrderDetails()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((order: MakaOrder) => !isEmpty(order) && !isEmpty(order.recurrence))
      )
      .subscribe((order: MakaOrder) => this.order$.next(order));
  }

  cancelRecurrentOrder(userId: string, orderId: string): void {
    if (!Boolean(orderId)) {
      return;
    }

    this.orderDetailsService.cancelRecurrenceOrder(userId, orderId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((order: MakaOrder) => this.order$.next(order));
  }

  isRecurrenceActive(order) {
    return order.recurrence?.status === RecurrenceOrderStatus.ACTIVE;
  }

  openModal(orderId: string) {
    this.modalRef = this.modalService.open(MakaCancelOrderRecurrenceModalComponent, {
      centered: true,
      backdrop: true,
      windowClass: 'cancel-recurrence-modal'
    });

    window.scrollTo(0, 0);

    this.modalRef.componentInstance.dismissModal = () => this.modalService.dismissActiveModal();

    this.modalRef.componentInstance
      .onCancelOrder = () => {
        this.modalService.dismissActiveModal();
        this.cancelRecurrentOrder('current', orderId);
      };
  }

  ngOnDestroy(): void {
    this.modalService.dismissActiveModal();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
