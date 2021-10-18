import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';

import { MakaOrderHistoryTableComponent } from './maka-order-history-table.component';


const mockOrderHistory = {
  orders: [
    {
      code: '1',
      placed: new Date('2018-01-01'),
      statusDisplay: 'test',
      petName: 'test',
      total: { formattedValue: '1' },
    },
    {
      code: '2',
      placed: new Date('2018-01-02'),
      statusDisplay: 'test2',
      petName: 'test2',
      total: { formattedValue: '2' },
    },
  ],
  pagination: { totalResults: 1, sort: 'byDate' },
  sorts: [{ code: 'byDate', selected: true }],
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

@Pipe({
  name: 'getPetName',
})
class MockGetPetNameFromOrderPipe implements PipeTransform {
  transform() {}
}

describe('MakaOrderHistoryTableComponent', () => {
  let component: MakaOrderHistoryTableComponent;
  let fixture: ComponentFixture<MakaOrderHistoryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [MakaOrderHistoryTableComponent, MockUrlPipe, MockGetPetNameFromOrderPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderHistoryTableComponent);
    component = fixture.componentInstance;
    component.orders = mockOrderHistory;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event to navigate to order detail', () => {
    spyOn(component.navigateToDetail, 'emit').and.stub();
    component.goToOrderDetail(null);
    expect(component.navigateToDetail.emit).toHaveBeenCalled();
  })
});
