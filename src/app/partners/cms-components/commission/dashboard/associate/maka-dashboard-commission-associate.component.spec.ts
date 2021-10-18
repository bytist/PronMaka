import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  I18nTestingModule,
} from '@spartacus/core';

import { MakaDashboardCommissionAssociateComponent } from './maka-dashboard-commission-associate.component';

import createSpy = jasmine.createSpy;


@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('MakaDashboardCommissionAssociateComponent', () => {
  let component: MakaDashboardCommissionAssociateComponent;
  let fixture: ComponentFixture<MakaDashboardCommissionAssociateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
      ],
      declarations: [MakaDashboardCommissionAssociateComponent, MockUrlPipe],
      providers: [
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaDashboardCommissionAssociateComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
