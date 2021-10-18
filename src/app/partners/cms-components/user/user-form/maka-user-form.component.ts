import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomFormValidators } from '@spartacus/storefront';

import { environment } from '../../../../../environments/environment';
import { MakaPartner } from '../../../../core/models/maka-user.model';


@Component({
  selector: 'app-maka-partner-user-form',
  templateUrl: './maka-user-form.component.html'
})
export class MakaPartnerUserFormComponent implements OnInit {

  @Output()
  submitForm = new EventEmitter<MakaPartner>();

  @Input()
  isProfileForm = false;

  @Input()
  partner: MakaPartner;

  userForm: FormGroup = this.formBuilder.group(
    {
      titleCode: [''],
      firstName: ['', [Validators.required, Validators.maxLength(35)]],
      lastName: ['', [Validators.required, Validators.maxLength(35)]],
      email: ['', [Validators.required, CustomFormValidators.emailValidator]],
      cellphone: ['', [Validators.required, Validators.pattern(environment.mexicanCellphoneFormat)]],
      rfc: ['', [Validators.required, Validators.pattern(environment.rfcFormat)]],
      legalEntityName: ['', Validators.maxLength(80)],
      password: [
        '',
        [Validators.required, CustomFormValidators.passwordValidator],
      ],
      passwordconf: ['', Validators.required],
      addressForm: this.formBuilder.group(
        {
          country: environment.defaultCountry,
          streetName: ['', [Validators.required, Validators.maxLength(60)]],
          streetNumber: ['', [Validators.required, Validators.maxLength(10)]],
          appartement: [''],
          district: ['', Validators.required],
          town: ['', [Validators.required, Validators.maxLength(40)]],
          region: this.formBuilder.group({
            isocode: [null, Validators.required],
          }),
          postalCode: ['', [Validators.required, Validators.pattern(environment.mexicanPostalCodeFormat)]],
          titleCode: ['', Validators.required],
          title: [''],
          businessName: [''],
        }),
      termsandconditions: [false, Validators.requiredTrue]
    },
    {
      validators: CustomFormValidators.passwordsMustMatch(
        'password',
        'passwordconf'
      ),
    }
  );

  constructor(protected formBuilder: FormBuilder) {}

  ngOnInit() {
    if (this.partner) {
      this.userForm.patchValue({
        firstName: this.partner.firstName,
        lastName: this.partner.lastName,
        email: this.partner.uid,
        rfc: this.partner.rfc,
        cellphone: this.partner.contactAddress.cellphone,
        legalEntityName: this.partner.legalEntityName,
        addressForm: {
          country: this.partner.contactAddress.country,
          streetName: this.partner.contactAddress.streetName,
          streetNumber: this.partner.contactAddress.streetNumber,
          titleCode: this.partner.contactAddress.titleCode,
          title: this.partner.contactAddress.title,
          businessName: this.partner.contactAddress.businessName,
          postalCode: this.partner.contactAddress.postalCode,
          district: this.partner.contactAddress.district,
          town: this.partner.contactAddress.town,
          region: this.partner.contactAddress.region,
          appartement: this.partner.contactAddress.appartement
        }
      });
    }

    if (this.isProfileForm) {
      this.userForm.disable();
    }
  }

  submitUserForm(): void {
    if (this.userForm.valid) {
      this.submitForm.emit(this.collectDataFromUserForm(this.userForm.value));
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  collectDataFromUserForm(formData: any): MakaPartner {
    const {
      firstName,
      lastName,
      email,
      cellphone,
      rfc,
      legalEntityName,
      password,
      addressForm
    } = formData;

    addressForm.cellphone = cellphone;

    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      rfc,
      legalEntityName,
      password,
      address: addressForm
    };
  }
}
