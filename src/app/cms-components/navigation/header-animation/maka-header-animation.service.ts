import { Injectable, OnDestroy } from '@angular/core';
import { BreakpointService, BREAKPOINT } from '@spartacus/storefront';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root',
})
export class MakaHeaderAnimationService implements OnDestroy {

  constructor(private breakpointService: BreakpointService) {}

  myAccountMenuOpened = false;
  navMenuOpened = false;
  isDesktop = false;
  myAccountMenuHeight = '450';
  myAccountMenuOpened$ = new BehaviorSubject<boolean>(this.myAccountMenuOpened);
  navMenuOpened$ = new BehaviorSubject<boolean>(this.navMenuOpened);
  unsubscribe$ = new Subject<void>();

  init() {
    this.breakpointService.breakpoint$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((breakpoint: BREAKPOINT) => {
        this.isDesktop = (breakpoint === BREAKPOINT.xl || breakpoint === BREAKPOINT.lg);
        this.myAccountMenuHeight = this.isDesktop ? '450' : 'auto';
        if (this.myAccountMenuOpened) {
          this.toggleMyAccountMenu();
        }
      });
  }

  openMyAccountMenu(callback?: () => any) {
    const headerLinksElement = document.querySelector('.HeaderLinks .childs');
    const timeline = gsap.timeline();
    timeline.pause();
      // staggered blocks
    timeline.to('.header-rect', {
        duration: 1,
        scaleY: 1,
        height: this.myAccountMenuHeight,
        ease: 'power4.inOut',
        stagger: {
          amount: .1
        }
      });

    if (this.isDesktop) {
      // open curtain and say hi text
      timeline.to('.nav-greeting h4', {
          css: {
            marginTop: (+this.myAccountMenuHeight - headerLinksElement.getBoundingClientRect().height) / 2
          }
        }, '-=1');

      timeline.to('.nav-greeting', {
          duration: 0.5,
          height: this.myAccountMenuHeight,
          ease: 'power4.inOut'
        }, '-=0.5');
    }

    // links
    timeline.to('.HeaderLinks .wrapper', {
        duration: 1,
        height: this.myAccountMenuHeight,
        opacity: 100,
        ease: 'power4.inOut'
      }, '-=0.7');

    // close menu navigation if opened (only applies for desktop)
    if (this.isDesktop && this.navMenuOpened) {
      this.toggleNavigationMenu(true, true, () => { timeline.play(); });
    } else {
      timeline.play();
    }

    if (callback) {
      timeline.eventCallback('onComplete', callback);
    }
  }

  closeMyAccountMenu(callback?: () => any) {
    const timeline = gsap.timeline();
    timeline.to('.nav-greeting', {
      duration: 1,
      height: 0,
      ease: 'power4.inOut'
    });

    // close curtain
    timeline.to('.HeaderLinks .wrapper', {
      duration: 1,
      height: 0,
      opacity: 0,
      ease: 'power4.inOut'
    }, '-=1');

    // close blocks
    timeline.to('.header-rect', {
      duration: 1,
      scaleY: 0,
      height: 0,
      ease: 'power4.out'
    }, '-=0.5');

    timeline.play();

    if (callback) {
      timeline.eventCallback('onComplete', callback);
    }
  }

  manageMyAccountMenu(callback?: () => any) {
    if (this.myAccountMenuOpened) {
      this.openMyAccountMenu(callback);
    } else {
      this.closeMyAccountMenu(callback);
    }
    this.myAccountMenuOpened$.next(this.myAccountMenuOpened);
  }

  toggleMyAccountMenu(forceCollapse?: boolean, callback?: () => any) {
    if (forceCollapse) {
      this.myAccountMenuOpened = false;
    } else {
      this.myAccountMenuOpened = !this.myAccountMenuOpened;
    }

    this.manageMyAccountMenu(callback);
  }

  openNavigationMenu(callback?: () => any) {
    const navigationElement = document.querySelector('.navigation');
    const headerElement = document.querySelector('header');
    const timeline = gsap.timeline()
      // staggered blocks
      .to('.header-rect', {
        duration: 1,
        scaleY: 1,
        height: navigationElement.getBoundingClientRect().height,
        ease: 'power4.inOut',
        stagger: {
          amount: .1
        }
      })
      // open navigation menu
      .to('.navigation', {
        duration: 1,
        css: { top: headerElement.getBoundingClientRect().height },
        ease: 'power4.inOut'
      }, '-=0.9');

    // close my account navigation first, if opened (only applies for desktop)
    if (this.isDesktop && this.myAccountMenuOpened) {
      this.toggleMyAccountMenu(true, () => {
        timeline.play();
      });
    } else {
      timeline.play();
    }

    if (callback) {
      timeline.eventCallback('onComplete', callback);
    }
  }

  closeNavigationMenu(triggeredByMenuLogic?: boolean, callback?: () => any) {
    const navHidePosition = -900;
    const timeline = gsap.timeline()
    // close navigation menu
      .to('.navigation', {
        duration: 1.5,
        css: {top: navHidePosition},
        ease: 'power4.inOut'
      })
      // close blocks
      .to('.header-rect', {
        duration: 1,
        scaleY: 0,
        height: 0,
        ease: 'power4.out'
      }, '-=0.5');

    if (this.myAccountMenuOpened && !triggeredByMenuLogic) {
      this.toggleMyAccountMenu(true, () => {
        timeline.play();
      });
    } else {
      timeline.play();
    }

    if (callback) {
      timeline.eventCallback('onComplete', callback);
    }
  }

  manageNavigationMenu(triggeredByMenuLogic?: boolean, callback?: () => any) {
    if (this.navMenuOpened) {
      this.openNavigationMenu(callback);
    } else {
      this.closeNavigationMenu(triggeredByMenuLogic, callback);
    }
    this.navMenuOpened$.next(this.navMenuOpened);
  }

  toggleNavigationMenu(forceCollapse?: boolean, triggeredByMenuLogic?: boolean, callback?: () => any) {
    if (forceCollapse) {
      this.navMenuOpened = false;
    } else {
      this.navMenuOpened = !this.navMenuOpened;
    }
    /**
     * Toggle navigation menu is triggered by:
     * 1 - Hamburger icon tap
     * 2 - When nav menu is opened and then my account menu is opened (desktop) -> this is triggeredByMenuLogic
     * 3 - When one of the my account links is clicked
     */
    this.manageNavigationMenu(triggeredByMenuLogic, callback);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
