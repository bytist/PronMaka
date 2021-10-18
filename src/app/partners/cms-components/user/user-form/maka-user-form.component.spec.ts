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
} from '@spartacus/core';
import {
  FormErrorsModule
} from '@spartacus/storefront';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import createSpy = jasmine.createSpy;

import { MakaPartnerUserFormComponent } from './maka-user-form.component';
import { environment } from '../../../../../environments/environment';

const mockFormData = {
  firstName: 'test',
  lastName: 'test',
  email: 'somethinG@test.com',
  cellphone: '999999999',
  rfc: 'rfc',
  legalEntityName: 'something',
  password: 'test',
  passwordconf: 'test',
  addressForm: {
    country: environment.defaultCountry,
    streetName: 'buxa',
    streetNumber: '100',
    appartement: '1',
    district: 'T',
    town: 'test',
    region: { isocode: 'TEST' },
    postalCode: '11300',
    titleCode: 'sr',
    businessName: 'test business'
  }
};

describe('MakaPartnerUserFormComponent', () => {
  let controls: any;
  let component: MakaPartnerUserFormComponent;
  let fixture: ComponentFixture<MakaPartnerUserFormComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaPartnerUserFormComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaPartnerUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
    controls = component.userForm.controls;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('collectDataFromUserForm()', () => {
    it('should return correct user data', () => {
      const form = mockFormData;
      const data = component.collectDataFromUserForm(form);
      expect(data.firstName).toEqual('test');
      expect(data.uid).toEqual('something@test.com');
      expect(data.address.businessName).toEqual('test business');
      expect(data.address.cellphone).toEqual('999999999');
    });
  });

  it('should call ngOnInit and remove CTA', () => {
    component.isProfileForm = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(el.query(By.css('button'))).toBeFalsy();
  });

  it('should call ngOnInit and show CTA', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(el.query(By.css('button'))).toBeTruthy();
  });
});
