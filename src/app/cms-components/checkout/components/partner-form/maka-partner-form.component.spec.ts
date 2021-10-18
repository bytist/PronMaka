import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  UserService,
  GlobalMessageService,
  AuthService
} from '@spartacus/core';
import { of, Observable } from 'rxjs';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPartnerFormComponent } from './maka-partner-form.component';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';
import { MakaPartner } from '../../../../core/models/maka-user.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';

import createSpy = jasmine.createSpy;

class MockUserService {
  get() {
    return of({ associateId: '11111111' });
  }
}

class MockAssociateService {
  search(associateId: string): Observable<MakaPartner> {
    return of(null);
  }
}

class MockAuthService {
  getOccUserId() {
    return of('id');
  }
}

class MockActiveCartService {
  isGuestCart(): Boolean {
    return false;
  }

  getActive() {
    return of({
      firstName: 'test',
      lastName: 'true',
      associateId: 'test'
    });
  }

  getActiveCartId() {
    return of('id');
  }

  removeAssociateId(cartId: string, userId: string, associateId: string): Observable<any> {
   return of(true);
  }

  addAssociateId(cartId: string, userId: string, associateId: string, preloaded: boolean): Observable<MakaPartner> {
    return of({
      firstName: 'test',
      lastName: 'true'
    });
  }
}

const mockGlobalMessageService = {
    add: createSpy(),
};

describe('MakaPartnerFormComponent', () => {
  let component: MakaPartnerFormComponent;
  let fixture: ComponentFixture<MakaPartnerFormComponent>;
  let activeCartService: MakaActiveCartService;
  let userService: UserService;
  let authService: AuthService;
  let makaAssociateService: MakaAssociateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, I18nTestingModule, FormErrorsModule],
      declarations: [MakaPartnerFormComponent],
      providers: [
        { provide: MakaActiveCartService, useClass: MockActiveCartService },
        { provide: MakaAssociateService, useClass: MockAssociateService },
        { provide: UserService, useClass: MockUserService },
        { provide: GlobalMessageService, useValue: mockGlobalMessageService },
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPartnerFormComponent);
    component = fixture.componentInstance;
    activeCartService = TestBed.inject(MakaActiveCartService);
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    makaAssociateService = TestBed.inject(MakaAssociateService);
    component.cartParams = { userId: 'test', cartId: 'test' };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should test setAssociateId with adding', () => {
    spyOn(component, 'addAssociateId');
    spyOn(makaAssociateService, 'search').and.returnValue(of({ associateId: 'test' }));
    component.setAssociateId();
    expect(component.addAssociateId).toHaveBeenCalled();
  });

  it('should test setAssociateId with removal', () => {
    spyOn(component, 'removeAssociateId');
    spyOn(makaAssociateService, 'search').and.returnValue(of(null));
    component.setAssociateId();
    expect(component.removeAssociateId).toHaveBeenCalled();
  });
});
