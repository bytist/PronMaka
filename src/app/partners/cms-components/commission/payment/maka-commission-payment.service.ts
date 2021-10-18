import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MakaCommissionPaymentService {

  sentToPayment: boolean;
  sentToPayment$: BehaviorSubject<boolean>;

  constructor() {
    this.sentToPayment$ = new BehaviorSubject(this.sentToPayment);
  }

  updateCommissionPaymentStatus(sentToPayment: boolean) {
    this.sentToPayment = sentToPayment;
    this.sentToPayment$.next(this.sentToPayment);
  }
}
