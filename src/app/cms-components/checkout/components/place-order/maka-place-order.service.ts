import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MakaPlaceOrderService {

  disablePlaceOrderBtn: boolean;
  disablePlaceOrderBtn$: BehaviorSubject<boolean>;

  constructor() {
    this.disablePlaceOrderBtn$ = new BehaviorSubject(this.disablePlaceOrderBtn);
  }

  updatePlaceOrderBtn(disablePlaceOrderBtn: boolean) {
    this.disablePlaceOrderBtn = disablePlaceOrderBtn;
    this.disablePlaceOrderBtn$.next(this.disablePlaceOrderBtn);
  }
}
