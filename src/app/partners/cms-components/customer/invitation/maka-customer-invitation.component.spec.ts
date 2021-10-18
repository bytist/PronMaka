import { Observable, of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorsModule } from '@spartacus/storefront';
import { CommonModule } from '@angular/common';
import { GlobalMessageService, I18nTestingModule } from '@spartacus/core';

import { MakaPartner } from '../../../../core/models/maka-user.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { CustomerInvitation } from '../../../../core/models/maka-customer-invitation.model';
import { MakaCustomerInvitationComponent } from './maka-customer-invitation.component';

import createSpy = jasmine.createSpy;

class MockGlobalMessageService {
  add = createSpy();
  remove = createSpy();

  get() {
    return of();
  }
}

class MockMakaAssociateService {
  getCurrentAssociate(): Observable<MakaPartner> {
    return of();
  }

  sendCustomerInvitation(customerInvitation: CustomerInvitation): Observable<any> {
    return of();
  }
}

describe('MakaCustomerInvitationComponent', () => {
  let component: MakaCustomerInvitationComponent;
  let fixture: ComponentFixture<MakaCustomerInvitationComponent>;

  let mockGlobalMessageService: GlobalMessageService;
  let mockMakaAssociateService: MakaAssociateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaCustomerInvitationComponent],
      providers: [
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: MakaAssociateService,
          useClass: MockMakaAssociateService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaCustomerInvitationComponent);
    mockMakaAssociateService = TestBed.inject(MakaAssociateService);
    mockGlobalMessageService = TestBed.inject(GlobalMessageService);

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component', () => {
    spyOn(mockMakaAssociateService, 'getCurrentAssociate').and.callThrough();

    component.ngOnInit();

    expect(mockMakaAssociateService.getCurrentAssociate).toHaveBeenCalled();
  });

  it('should send customer invitation when form is valid', () => {
    spyOn(mockMakaAssociateService, 'sendCustomerInvitation').and.callThrough();
    component.invitationForm.setValue({email: 'email@test.com'});

    component.submitForm();

    expect(mockMakaAssociateService.sendCustomerInvitation).toHaveBeenCalled();
  });

  it('should fail to send send customer invitation when form is not valid', () => {
    spyOn(mockMakaAssociateService, 'sendCustomerInvitation').and.callThrough();

    component.submitForm();

    expect(mockMakaAssociateService.sendCustomerInvitation).not.toHaveBeenCalled();
    expect(component.invitationForm.valid).toBe(false);
  });
});
