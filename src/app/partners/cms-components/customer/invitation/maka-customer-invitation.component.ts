import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomFormValidators } from '@spartacus/storefront';
import { GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MakaPartner } from '../../../../core/models/maka-user.model';
import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';

@Component({
  selector: 'app-maka-customer-invitation',
  templateUrl: './maka-customer-invitation.component.html'
})
export class MakaCustomerInvitationComponent implements OnInit, OnDestroy {
  partner$: Observable<MakaPartner>;
  unsubscribe$ = new Subject<void>();

  invitationForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, CustomFormValidators.emailValidator]],
  });

  constructor(
    private fb: FormBuilder,
    private globalMessageService: GlobalMessageService,
    private makaAssociateService: MakaAssociateService) {
  }

  ngOnInit(): void {
    this.partner$ = this.makaAssociateService.getCurrentAssociate();
  }

  submitForm(): void {
    if (this.invitationForm.valid) {
      this.makaAssociateService.sendCustomerInvitation(this.invitationForm.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(ok => {
          this.globalMessageService.add(
            {key: 'partner.invitation.invitationSentMessage'},
            GlobalMessageType.MSG_TYPE_CONFIRMATION
          );
          this.invitationForm.reset({email: ''});
        });
    } else {
      this.invitationForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
