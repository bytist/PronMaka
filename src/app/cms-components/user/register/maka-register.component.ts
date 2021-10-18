import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  UserService,
  GlobalMessageService,
  RoutingService,
  AnonymousConsentsService,
  AnonymousConsentsConfig,
  GlobalMessageEntities,
  GlobalMessageType,
  AnonymousConsent,
  ConsentTemplate
} from '@spartacus/core';
import {
  RegisterComponent,
  sortTitles
} from '@spartacus/storefront';
import {
  combineLatest,
  Subject
} from 'rxjs';
import {
  filter,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';

import { AssociateStatus, MakaUserSignUp } from 'src/app/core/models/maka-user.model';
import { MakaAssociateService } from 'src/app/shared/services/maka-associate/maka-associate.service';

@Component({
  selector: 'app-maka-register',
  templateUrl: './maka-register.component.html'
})
export class MakaRegisterComponent extends RegisterComponent implements OnInit, OnDestroy {

  unsubscribe$ = new Subject<void>();
  associateId: string;
  associateName: string;

  constructor(
    protected userService: UserService,
    protected globalMessageService: GlobalMessageService,
    protected fb: FormBuilder,
    protected router: RoutingService,
    protected anonymousConsentsService: AnonymousConsentsService,
    protected anonymousConsentsConfig: AnonymousConsentsConfig,
    protected activatedRoute: ActivatedRoute,
    protected associateService: MakaAssociateService
  ) {
    super(
      userService,
      globalMessageService,
      fb,
      router,
      anonymousConsentsService,
      anonymousConsentsConfig
    );
  }

  /**
   * This method replaces original implementation because of those properties and methods that are private
   * and were required to be customized.
   */
  ngOnInit() {
    // Same as original implementation
    this.titles$ = this.userService.getTitles().pipe(
      tap((titles) => {
        if (Object.keys(titles).length === 0) {
          this.userService.loadTitles();
        }
      }),
      map((titles) => {
        return titles.sort(sortTitles);
      })
    );

    this.loading$ = this.userService.getRegisterUserResultLoading();
    // The next line replaces this.registerUserProcessInit() since it is private and it cannt be overriden
    this.initializeRegisterProcess();

    // This part changes from its original implementation in favor of using unsubscribe$ to be consistent
    // with the use of subscriptions
    this.globalMessageService.get()
    .pipe(
      takeUntil(this.unsubscribe$),
      filter((messages) => !!Object.keys(messages).length)
    ).subscribe((globalMessageEntities: GlobalMessageEntities) => {
      const messages = globalMessageEntities && globalMessageEntities[GlobalMessageType.MSG_TYPE_ERROR];

      if (messages && messages.some((message) => message === 'This field is required.')) {
        this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
        this.globalMessageService.add({ key: 'register.titleRequired' }, GlobalMessageType.MSG_TYPE_ERROR);
      }
    });

    // This section remains the same as the original implementation
    const { registerConsent } = this.anonymousConsentsConfig?.anonymousConsents;

    this.anonymousConsent$ = combineLatest([
      this.anonymousConsentsService.getConsent(registerConsent),
      this.anonymousConsentsService.getTemplate(registerConsent),
    ]).pipe(
      map(([consent, template]: [AnonymousConsent, ConsentTemplate]) => {
        return {
          consent,
          template: template ? template.description : '',
        };
      })
    );

    // This part changes from its original implementation in favor of using unsubscribe$ to be consistent
    // with the use of subscriptions
    this.registerForm.get('newsletter').valueChanges
    .pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.toggleAnonymousConsent();
    });
  }

  /**
   * This method replaces original registerUserProcessInit since it was private and it was
   * required ti be overriden to use unsubscribe$ and set potential associate name
   */
  initializeRegisterProcess(): void {
    this.associateId = this.activatedRoute?.snapshot?.queryParams?.[
      'associateId'
    ];

    if (this.associateId) {
      this.associateService.search(this.associateId).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(partner => {
        if (partner.associateStatus === AssociateStatus.ACTIVE) {
          this.associateName = `${partner.firstName} ${partner.lastName}`;
        }
      });
    }
    this.userService.resetRegisterUserProcessState();
    this.userService.getRegisterUserResultSuccess().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((success) => {
      this.onSuccessRegistration(success);
    });
  }

  /**
   * This method relaces original onRegisterUserSuccess since it was private and it was
   * required to be overriden to add the new logic
   * @param success Result of user registration
   */
  onSuccessRegistration(success: boolean): void {
    if (success) {
      this.router.go('login');
      if (this.associateId) {
        if (this.associateName) {
          this.globalMessageService.add(
            { key: 'register.postRegisterMessageWithInvitation', params: { associateName: this.associateName } },
            GlobalMessageType.MSG_TYPE_CONFIRMATION
          );
        } else {
          this.globalMessageService.add(
            { key: 'register.postRegisterMessageInvalidAssociate' },
            GlobalMessageType.MSG_TYPE_WARNING
          );
        }
      } else {
        this.globalMessageService.add(
          { key: 'register.postRegisterMessage' },
          GlobalMessageType.MSG_TYPE_CONFIRMATION
        );
      }
    }
  }

  /**
   * This method was overriden to include the new attribute in model MakaUserSignUp
   * @param formData Data from the user registration form
   */
  collectDataFromRegisterForm(formData: any): MakaUserSignUp {
    const { firstName, lastName, email, password, titleCode } = formData;

    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      password,
      titleCode,
      associateId: this.associateName ? this.associateId : undefined
    };
  }

  /**
   * This method extends the ngONDestroy from the parent to unsubscribe
   * the generated subscriprions from new code
   */
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    super.ngOnDestroy();
  }
}
