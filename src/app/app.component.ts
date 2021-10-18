import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, Event, NavigationEnd } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MakaHeaderAnimationService } from './cms-components/navigation/header-animation/maka-header-animation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'maka-storefront';
  myAccountMenuOpened$ = this.makaHeaderAnimationService.myAccountMenuOpened$;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private makaHeaderAnimationService: MakaHeaderAnimationService,
    private router: Router
  ) {
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {
        // TODO - check how to trigger scroll trigger refresh without timeout (maybe event triggering or alternative lifcecycle hooks)
        setTimeout(() => { ScrollTrigger.refresh(); }, 1200);
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.makaHeaderAnimationService.init();
    }
  }
}
