import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import {
  I18nTestingModule,
  GlobalMessageService,
  RoutingService
} from '@spartacus/core';
import {
  of
} from 'rxjs';
import {
  FormErrorsModule
} from '@spartacus/storefront'
import { Pipe, PipeTransform } from '@angular/core';;
import { RouterTestingModule } from '@angular/router/testing';
import createSpy = jasmine.createSpy;

import { MakaPartnerRegisterComponent } from './maka-register.component';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { MakaPartner } from '../../../../core/models/maka-user.model';
import {environment} from "../../../../../environments/environment";

class MockGlobalMessageService {
  add = createSpy();
  remove = createSpy();
  get() {
    return of();
  }
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockRoutingService {
  go = createSpy();
}

class MockMakaAssociateService {
  register(partner: MakaPartner) {
    return of();
  }
}

const mockPartner = {
  firstName: 'test',
  lastName: 'test',
  email: 'somethinG@test.com',
  cellphone: '999999999',
  rfc: 'rfc',
  legalEntityName: 'something',
  password: 'test',
  passwordconf: 'test',
  address: {
    country: environment.defaultCountry,
    streetName: 'buxa',
    streetNumber: '100',
    appartment: '1',
    district: 'T',
    town: 'test',
    region: { isocode: 'TEST' },
    postalCode: '11300',
    titleCode: 'sr',
    businessName: 'test business'
  }
};

describe('MakaPartnerRegisterComponent', () => {
  let component: MakaPartnerRegisterComponent;
  let fixture: ComponentFixture<MakaPartnerRegisterComponent>;

  let mockAssociateService: MakaAssociateService;
  let mockGlobalMessageService: GlobalMessageService;
  let mockRoutingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaPartnerRegisterComponent, MockUrlPipe],
      providers: [
        { provide: MakaAssociateService, useClass: MockMakaAssociateService },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPartnerRegisterComponent);
    mockAssociateService = TestBed.inject(MakaAssociateService);
    mockGlobalMessageService = TestBed.inject(GlobalMessageService);
    mockRoutingService = TestBed.inject(RoutingService);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call maka associate service register', () => {
    spyOn(mockAssociateService, 'register').and.stub();

    component.registerUser(mockPartner);
    expect(mockAssociateService.register).toHaveBeenCalled();
  });

  it('should call maka associate service register', () => {
    spyOn(mockAssociateService, 'register').and.returnValue(of({}));

    component.submitForm({ name: 'test', displayUid: 'test' });
    expect(mockAssociateService.register).toHaveBeenCalled();
    expect(mockRoutingService.go).toHaveBeenCalled();
  });
});
