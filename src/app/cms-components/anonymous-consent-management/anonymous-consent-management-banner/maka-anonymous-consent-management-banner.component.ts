import { Component, OnDestroy, ViewContainerRef, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { TranslationService, AnonymousConsentsService } from '@spartacus/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AnonymousConsentManagementBannerComponent,
  AnonymousConsentLaunchDialogService
} from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-maka-anonymous-consent-management-banner',
  templateUrl: './maka-anonymous-consent-management-banner.component.html'
})
export class MakaAnonymousConsentManagementBannerComponent
  extends AnonymousConsentManagementBannerComponent implements AfterViewInit, OnDestroy {

  descriptionHtml$: Observable<SafeHtml> = this.translationService.translate('anonymousConsents.banner.description');
  display = false;

  constructor(
    protected anonymousConsentsService: AnonymousConsentsService,
    protected anonymousConsentLaunchDialogService: AnonymousConsentLaunchDialogService,
    protected viewContainerRef: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: any,
    private translationService: TranslationService) {
    super(anonymousConsentsService, anonymousConsentLaunchDialogService, viewContainerRef);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.display = true;
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
