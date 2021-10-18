import { TestBed } from '@angular/core/testing';

import { MakaPlaceOrderService } from './maka-place-order.service';

describe('MakaPlaceOrderService', () => {
  let service: MakaPlaceOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MakaPlaceOrderService
      ],
    });
    service = TestBed.inject(MakaPlaceOrderService);
  });

  describe('MakaPlaceOrderService', () => {
    it('should update place order btn to true', done => {
      service.updatePlaceOrderBtn(true);
      const result = service.disablePlaceOrderBtn$.subscribe((res) => {
        expect(res).toEqual(true);
        done();
      }).unsubscribe();
    });

    it('should update place order btn to false', done => {
      service.updatePlaceOrderBtn(false);
      const result = service.disablePlaceOrderBtn$.subscribe((res) => {
        expect(res).toEqual(false);
        done();
      }).unsubscribe();
    });
  });

});
