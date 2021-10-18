import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import {
  LoginFormComponent,
  CheckoutConfigService
} from '@spartacus/storefront';
import {
  AuthService,
  GlobalMessageService,
  AuthRedirectService,
  WindowRef
} from '@spartacus/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { MakaBaseSiteService } from 'src/app/shared/services/maka-base-site/maka-base-site.service';

@Component({
  selector: 'app-maka-login-form',
  templateUrl: './maka-login-form.component.html'
})
export class MakaLoginFormComponent extends LoginFormComponent implements OnInit, OnDestroy {

  @Input()
  coreVersion = false;

  isClientSite$: Observable<boolean>;

  constructor(
    protected auth: AuthService,
    protected globalMessageService: GlobalMessageService,
    protected fb: FormBuilder,
    protected authRedirectService: AuthRedirectService,
    protected winRef: WindowRef,
    protected activatedRoute: ActivatedRoute,
    protected checkoutConfigService: CheckoutConfigService,
    private makaBaseSiteService: MakaBaseSiteService
  ) {
    super(
      auth,
      globalMessageService,
      fb,
      authRedirectService,
      winRef,
      activatedRoute,
      checkoutConfigService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.isClientSite$ = this.makaBaseSiteService.getBaseSiteData()
      .pipe(
        map((baseSite) => {
          return (baseSite.uid === 'maka-store');
        }),
        share() // so that async pipes in DOM share same stream :);
      );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
