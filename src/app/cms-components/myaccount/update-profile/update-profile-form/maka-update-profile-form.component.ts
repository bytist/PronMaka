import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { UpdateProfileFormComponent } from '@spartacus/storefront';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { MakaUser } from '../../../../core/models/maka-user.model';

@Component({
  selector: 'app-maka-update-profile-form',
  templateUrl: './maka-update-profile-form.component.html'
})
export class MakaUpdateProfileFormComponent extends UpdateProfileFormComponent implements OnInit {
  @Input()
  user: MakaUser;

  @Output()
  submitted = new EventEmitter<{ userUpdates: MakaUser }>();

  updateProfileForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    associateId: ['']
  });

  constructor(private formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
