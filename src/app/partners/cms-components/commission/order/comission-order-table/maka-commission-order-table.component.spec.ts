import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule, Price } from '@spartacus/core';

import { MakaCommissionOrderTableComponent } from './maka-commission-order-table.component';
import { PaginationModel } from '@spartacus/core/src/model/misc.model';

import {
  AssociateDashboardCommissionOrder,
  AssociateDashboardCommissionOrders
} from '../../../../../core/models/maka-associate-dashboard-commission-orders.model';

const paginationData: PaginationModel = {
  currentPage: 0,
  pageSize: 5,
  totalPages: 2,
  totalResults: 9
};

const totalPrice: Price = {
  currencyIso: 'MXN',
  formattedValue: '$10,000.00 MXN',
  value: 10000.0
};

const order: AssociateDashboardCommissionOrder = {
  code: 'C0001',
  date: new Date(),
  user: { name: 'test' },
  total: totalPrice
};

const commissionOrders: AssociateDashboardCommissionOrders = {
  orders: [order],
  pagination: paginationData
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {
  }
}

describe('MakaCommissionOrderTableComponent', () => {
  let component: MakaCommissionOrderTableComponent;
  let fixture: ComponentFixture<MakaCommissionOrderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, RouterTestingModule],
      declarations: [MakaCommissionOrderTableComponent, MockUrlPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCommissionOrderTableComponent);
    component = fixture.componentInstance;
    component.orders = commissionOrders;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event to change page', () => {
    spyOn(component.gotToPage, 'emit').and.stub();
    component.pageChange(1);
    expect(component.gotToPage.emit).toHaveBeenCalledWith(1);
  });
});
