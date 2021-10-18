import { ChangeDetectionStrategy } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  I18nTestingModule,
  Region,
  Title,
  UserAddressService,
  UserService,
} from '@spartacus/core';
import {
  Observable,
  of
} from 'rxjs';
import {
  FormErrorsModule, CustomFormValidators
} from '@spartacus/storefront';
import createSpy = jasmine.createSpy;

import { MakaPartnerAddressFormComponent } from './maka-address-form.component';
import { environment } from '../../../../../environments/environment';

class MockUserService {
  getTitles(): Observable<Title[]> {
    return of();
  }

  loadTitles() {
  }
}

class MockUserAddressService {
  getRegions(): Observable<Region[]> {
    return of();
  }
}

const mockRegions: Region[] = [
  {
    isocode: 'MX-JAL',
    name: 'Jalisco',
  },
  {
    isocode: 'MX-MEX',
    name: 'Mexico',
  },
];

const mockTitles: Title[] = [
  { code: 'test', name: 'Test'}
];

describe('MakaPartnerAddressFormComponent', () => {
  let component: MakaPartnerAddressFormComponent;
  let fixture: ComponentFixture<MakaPartnerAddressFormComponent>;

  let userAddressService: UserAddressService;
  let userService: UserService;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgSelectModule,
        I18nTestingModule,
        FormErrorsModule
      ],
      declarations: [MakaPartnerAddressFormComponent],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: FormBuilder },
        { provide: UserAddressService, useClass: MockUserAddressService },
      ],
    })
      .overrideComponent(MakaPartnerAddressFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    userService = TestBed.inject(UserService);
    userAddressService = TestBed.inject(UserAddressService);
    formBuilder = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPartnerAddressFormComponent);
    component = fixture.componentInstance;
    component.parentForm = formBuilder.group({
        titleCode: [''],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, CustomFormValidators.emailValidator]],
        cellphone: ['', Validators.required],
        rfc: ['', Validators.required],
        legalEntityName: [''],
        password: [
          '',
          [Validators.required, CustomFormValidators.passwordValidator],
        ],
        passwordconf: ['', Validators.required],
        addressForm: formBuilder.group(
          {
            country: environment.defaultCountry,
            streetName: ['', Validators.required],
            streetNumber: ['', Validators.required],
            appartement: [''],
            district: ['', Validators.required],
            town: ['', Validators.required],
            region: formBuilder.group({
              isocode: [null, Validators.required],
            }),
            postalCode: ['', Validators.required],
            titleCode: ['', Validators.required],
            businessName: [''],
          }),
        termsandconditions: [false, Validators.requiredTrue]
      },
      {
        validators: CustomFormValidators.passwordsMustMatch(
          'password',
          'passwordconf'
        ),
      });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should test compare title function', () => {
    const a = { code: 'codeA', name: 'nameA' };
    const b = { code: 'codeB', name: 'nameB' };
    const c = { code: 'codeA', name: 'nameA' };
    expect(component.compareTitle(a, b)).toBe(false);
    expect(component.compareTitle(a, c)).toBe(true);
  });

  it('should call ngOnInit to get regions data when data exist', () => {
    spyOn(userAddressService, 'getRegions').and.returnValue(of(mockRegions));

    component.ngOnInit();

    let regions: Region[];
    component.regions$
      .subscribe((data) => {
        regions = data;
      })
      .unsubscribe();

    expect(regions).toBe(mockRegions);
  });

  it('should call ngOnInit to get titles data when data exist', () => {
    spyOn(userService, 'getTitles').and.returnValue(of(mockTitles));

    component.ngOnInit();

    let titles: Title[];
    component.titles$
      .subscribe((data) => {
        titles = data;
      })
      .unsubscribe();

    expect(titles).toBe(mockTitles);
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
});
