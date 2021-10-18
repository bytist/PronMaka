import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  of
} from 'rxjs';
import { I18nTestingModule } from '@spartacus/core';

import { MakaPartnerUpdateProfileComponent } from './maka-update-profile.component';
import { MakaPartner } from 'src/app/core/models/maka-user.model';
import { MakaAssociateService } from 'src/app/shared/services/maka-associate/maka-associate.service';

class MockMakaAssociateService {
  getCurrentAssociate(): Observable<MakaPartner> {
    return of();
  }
}

describe('MakaPartnerUpdateProfileComponent', () => {
  let component: MakaPartnerUpdateProfileComponent;
  let associateService: MockMakaAssociateService;
  let fixture: ComponentFixture<MakaPartnerUpdateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        I18nTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MakaAssociateService, useClass: MockMakaAssociateService }
      ],
      declarations: [ MakaPartnerUpdateProfileComponent ]
    })
    .compileComponents();

    associateService = TestBed.inject(MakaAssociateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPartnerUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
