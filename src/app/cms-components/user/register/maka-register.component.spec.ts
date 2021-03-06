import {
  Component,
  Pipe,
  PipeTransform
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ANONYMOUS_CONSENT_STATUS,
  AnonymousConsent,
  AnonymousConsentsConfig,
  AnonymousConsentsService,
  ConsentTemplate,
  GlobalMessageService,
  GlobalMessageType,
  I18nTestingModule,
  RoutingService,
  Title,
  UserService,
} from '@spartacus/core';
import {
  BehaviorSubject,
  Observable,
  of
} from 'rxjs';
import { FormErrorsModule } from '@spartacus/storefront';
import createSpy = jasmine.createSpy;

import { MakaRegisterComponent } from './maka-register.component';
import { AssociateStatus, MakaPartner } from 'src/app/core/models/maka-user.model';
import { MakaAssociateService } from 'src/app/shared/services/maka-associate/maka-associate.service';


const mockRegisterFormData: any = {
  titleCode: 'Mr',
  firstName: 'John',
  lastName: 'Doe',
  email: 'JohnDoe@thebest.john.intheworld.com',
  email_lowercase: 'johndoe@thebest.john.intheworld.com',
  termsandconditions: true,
  password: 'strongPass$!123',
};

const mockTitlesList: Title[] = [
  {
    code: 'mr',
    name: 'Mr.',
  },
  {
    code: 'mrs',
    name: 'Mrs.',
  },
];

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

@Component({
  selector: 'cx-spinner',
  template: '',
})
class MockSpinnerComponent {}

const registerUserIsLoading: BehaviorSubject<boolean> = new BehaviorSubject(
  false
);
const registerUserIsSuccess: BehaviorSubject<boolean> = new BehaviorSubject(
  false
);

class MockUserService {
  loadTitles(): void {}
  resetRegisterUserProcessState(): void {}

  getTitles(): Observable<Title[]> {
    return of([]);
  }

  register(
    _titleCode: string,
    _firstName: string,
    _lastName: string,
    _email: string,
    _password: string
  ): void {}

  getRegisterUserResultLoading(): Observable<boolean> {
    return registerUserIsLoading.asObservable();
  }
  getRegisterUserResultSuccess(): Observable<boolean> {
    return registerUserIsSuccess.asObservable();
  }
}

class MockGlobalMessageService {
  add = createSpy();
  remove = createSpy();
  get() {
    return of();
  }
}

class MockRoutingService {
  go = createSpy();
}

class MockAnonymousConsentsService {
  getConsent(_templateCode: string): Observable<AnonymousConsent> {
    return of();
  }
  getTemplate(_templateCode: string): Observable<ConsentTemplate> {
    return of();
  }
  withdrawConsent(_templateCode: string): void {}
  giveConsent(_templateCode: string): void {}
  isConsentGiven(_consent: AnonymousConsent): boolean {
    return true;
  }
}
const mockPartner: MakaPartner = {
  firstName: 'Hans',
  lastName: 'Lopez',
  associateStatus: AssociateStatus.ACTIVE
}
class MockMakaAssociateService {
  search(associateId: string): Observable<MakaPartner> {
    return of(mockPartner);
  }
}

const mockAnonymousConsentsConfig: AnonymousConsentsConfig = {
  anonymousConsents: {
    registerConsent: 'MARKETING',
    requiredConsents: ['MARKETING'],
  },
};

describe('MakaRegisterComponent', () => {
  let controls: any;
  let component: MakaRegisterComponent;
  let fixture: ComponentFixture<MakaRegisterComponent>;

  let userService: UserService;
  let mockGlobalMessageService: GlobalMessageService;
  let mockRoutingService: RoutingService;
  let anonymousConsentService: AnonymousConsentsService;
  let mockMakaAsspciateService: MakaAssociateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaRegisterComponent, MockUrlPipe, MockSpinnerComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: AnonymousConsentsService,
          useClass: MockAnonymousConsentsService,
        },
        {
          provide: AnonymousConsentsConfig,
          useValue: mockAnonymousConsentsConfig,
        },
        {
          provide: MakaAssociateService,
          useClass: MockMakaAssociateService
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaRegisterComponent);
    userService = TestBed.inject(UserService);
    mockGlobalMessageService = TestBed.inject(GlobalMessageService);
    mockRoutingService = TestBed.inject(RoutingService);
    anonymousConsentService = TestBed.inject(AnonymousConsentsService);
    mockMakaAsspciateService = TestBed.inject(MakaAssociateService);

    component = fixture.componentInstance;

    fixture.detectChanges();
    controls = component.registerForm.controls;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load titles', () => {
      spyOn(userService, 'getTitles').and.returnValue(of(mockTitlesList));

      component.ngOnInit();

      let titleList: Title[];
      component.titles$
        .subscribe((data) => {
          titleList = data;
        })
        .unsubscribe();
      expect(titleList).toEqual(mockTitlesList);
    });

    it('should fetch titles if the state is empty', (done) => {
      spyOn(userService, 'loadTitles').and.stub();
      spyOn(userService, 'getTitles').and.returnValue(of([]));

      component.ngOnInit();

      component.titles$
        .subscribe(() => {
          expect(userService.loadTitles).toHaveBeenCalled();
          done();
        })
        .unsubscribe();
    });

    it('should fetch registerUser process loading state', () => {
      const getSpinner = () => fixture.debugElement.query(By.css('cx-spinner'));
      component.ngOnInit();

      // when false
      registerUserIsLoading.next(false);
      fixture.detectChanges();

      expect(getSpinner()).toBeFalsy();

      // when true
      registerUserIsLoading.next(true);
      fixture.detectChanges();

      expect(getSpinner()).toBeTruthy();
    });
  });

  describe('collectDataFromRegisterForm()', () => {
    it('should return correct register data', () => {
      const form = mockRegisterFormData;

      expect(component.collectDataFromRegisterForm(form)).toEqual({
        firstName: form.firstName,
        lastName: form.lastName,
        uid: form.email_lowercase,
        password: form.password,
        titleCode: form.titleCode,
        associateId: undefined
      });
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      spyOn(userService, 'register').and.stub();

      component.ngOnInit();
      component.registerUser();
    });

    it('should submit form', () => {
      expect(userService.register).toHaveBeenCalled();
    });

    it('should redirect to login page and show message (new flow)', () => {
      registerUserIsSuccess.next(true);

      expect(mockRoutingService.go).toHaveBeenCalledWith('login');
      expect(mockGlobalMessageService.add).toHaveBeenCalledWith(
        { key: 'register.postRegisterMessage' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    });
  });

  const toggleAnonymousConsentMethod = 'toggleAnonymousConsent';
  describe(`${toggleAnonymousConsentMethod}`, () => {
    it('should call anonymousConsentsService.giveConsent when the consent is given', () => {
      spyOn(anonymousConsentService, 'giveConsent').and.stub();
      component.ngOnInit();

      controls['newsletter'].setValue(true);
      component.toggleAnonymousConsent();
      expect(anonymousConsentService.giveConsent).toHaveBeenCalled();
    });
    it('should call anonymousConsentsService.withdrawConsent when the consent is NOT given', () => {
      spyOn(anonymousConsentService, 'withdrawConsent').and.stub();
      component.ngOnInit();

      controls['newsletter'].setValue(false);
      component.toggleAnonymousConsent();
      expect(anonymousConsentService.withdrawConsent).toHaveBeenCalled();
    });
  });

  describe('isConsentGiven', () => {
    it('should call anonymousConsentsService.isConsentGiven', () => {
      spyOn(anonymousConsentService, 'isConsentGiven').and.stub();
      const mockConsent: AnonymousConsent = {
        consentState: ANONYMOUS_CONSENT_STATUS.GIVEN,
      };
      component.isConsentGiven(mockConsent);
      expect(anonymousConsentService.isConsentGiven).toHaveBeenCalledWith(
        mockConsent
      );
    });
  });

  const isConsentRequiredMethod = 'isConsentRequired';
  describe('isConsentRequired', () => {
    it('should disable form when register consent is required', () => {
      expect(component[isConsentRequiredMethod]()).toEqual(true);
    });

    it('should disable input when register consent is required', () => {
      spyOn<any>(component, isConsentRequiredMethod).and.returnValue(true);

      fixture.detectChanges();

      expect(controls['newsletter'].status).toEqual('DISABLED');
    });
  });
});
