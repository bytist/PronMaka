import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  I18nTestingModule,
} from '@spartacus/core';
import { of } from 'rxjs';

import { MakaDashboardCommissionLevelComponent } from './maka-dashboard-commission-level.component';
import { MakaAssociateService } from '../../../../../shared/services/maka-associate/maka-associate.service';

import createSpy = jasmine.createSpy;

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockMakaAssociateService {
  getDashboardStats() {
    return of([]);
  }
}

describe('MakaDashboardCommissionLevelComponent', () => {
  let component: MakaDashboardCommissionLevelComponent;
  let fixture: ComponentFixture<MakaDashboardCommissionLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
      ],
      declarations: [MakaDashboardCommissionLevelComponent, MockUrlPipe],
      providers: [
        { provide: MakaAssociateService, useClass: MockMakaAssociateService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaDashboardCommissionLevelComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
