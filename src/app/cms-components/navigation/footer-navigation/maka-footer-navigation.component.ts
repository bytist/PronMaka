import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  PLATFORM_ID,
  Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CmsComponentData, NavigationService, FooterNavigationComponent } from '@spartacus/storefront';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CmsMakaFooterNavigationComponent } from '../../../core/models/maka-cms.model';

@Component({
  selector: 'app-maka-footer-navigation',
  templateUrl: './maka-footer-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaFooterNavigationComponent extends FooterNavigationComponent implements OnInit {

  constructor(
    protected componentData: CmsComponentData<CmsMakaFooterNavigationComponent>,
    protected navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: any,
    private changeDetector: ChangeDetectorRef
  ) {
    super(componentData, navigationService);
  }

  darkMode = false;

  contactInfoHtml$: Observable<SafeHtml> = this.componentData.data$.pipe(
    filter(data => !!data),
    map((data) => data.contactInfo)
  );

  customLinksHtml$: Observable<SafeHtml> = this.componentData.data$.pipe(
    filter(data => !!data),
    map((data) => data.customLinks)
  );

  helpInfoHtml$: Observable<SafeHtml> = this.componentData.data$.pipe(
    filter(data => !!data),
    map((data) => data.helpInfo)
  );

  noticeHtml$: Observable<SafeHtml> = this.componentData.data$.pipe(
    filter(data => !!data),
    map((data) => data.notice)
  );

  sociaNetworksLinks$: Observable<SafeHtml> = this.componentData.data$.pipe(
    filter(data => !!data),
    map((data) => data.socialNetworksLinks)
  );

  enableFooterAnimation() {
    gsap.to('.footer-layer', {
      scrollTrigger: {
        trigger: 'footer',
        start: 'top bottom',
        toggleActions: 'play reverse play reverse',
        refreshPriority: 1, // this establishes the order of scroll triggering refreshing
        onLeaveBack: () => {
          this.darkMode = false;
          this.changeDetector.detectChanges();
        },
        onLeave: () => {
          this.darkMode = false;
          this.changeDetector.detectChanges();
        },
        onEnter: () => {
          this.darkMode = true;
          this.changeDetector.detectChanges();
        }
      },
      duration: 1,
      height: '100%'
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.enableFooterAnimation();
    }
  }
}
