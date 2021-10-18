import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthRedirectService,
  AuthService,
  GlobalMessageService,
  I18nTestingModule,
  UserToken,
  WindowRef,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CheckoutConfigService, FormErrorsModule } from '@spartacus/storefront';

import { MakaLoginFormComponent } from './maka-login-form.component';
import { MakaBaseSiteService } from '../../../shared/services/maka-base-site/maka-base-site.service';
import { MakaBaseSite } from '../../../core/models/maka-site.model';
import { EnvironmentType } from '../../../core/models/maka-globals-vars.model';

import createSpy = jasmine.createSpy;

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockAuthService {
  authorize = createSpy();
  getUserToken(): Observable<UserToken> {
    return of({ access_token: 'test' } as UserToken);
  }
}

class MockRedirectAfterAuthService {
  redirect = createSpy('AuthRedirectService.redirect');
}
class MockGlobalMessageService {
  remove = createSpy();
}

class MockActivatedRoute {
  snapshot = {
    queryParams: {
      forced: false,
    },
  };
}

class MockCheckoutConfigService {
  isGuestCheckout() {
    return false;
  }
}

class MockMakaBaseSiteService {
  getBaseSiteData(): Observable<MakaBaseSite> {
    return of({
      uid: 'maka-store',
      countries: [],
      languages: [],
      environmentType: EnvironmentType.DEVELOPMENT
    });
  }
}

describe('MakaLoginFormComponent', () => {
  let component: MakaLoginFormComponent;
  let fixture: ComponentFixture<MakaLoginFormComponent>;

  let authService: AuthService;
  let authRedirectService: AuthRedirectService;
  let windowRef: WindowRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      declarations: [MakaLoginFormComponent, MockUrlPipe],
      providers: [
        WindowRef,
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: AuthRedirectService,
          useClass: MockRedirectAfterAuthService,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: CheckoutConfigService, useClass: MockCheckoutConfigService },
        { provide: MakaBaseSiteService, useClass: MockMakaBaseSiteService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaLoginFormComponent);
    component = fixture.componentInstance;
    component.coreVersion = false;
    authService = TestBed.inject(AuthService);
    authRedirectService = TestBed.inject(AuthRedirectService);
    windowRef = TestBed.inject(WindowRef);
  });

  beforeEach(() => {
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
