import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap, SteppedEase } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExpoScaleEase } from 'gsap/EasePack';

@Component({
  selector: 'app-maka-product-journey',
  templateUrl: './maka-product-journey.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaProductJourneyComponent implements OnInit {

  showcaseItems = this.getShowcaseItems();
  zoomOutDone = false;
  showcaseSlideDone = false;
  display = false;

  seniorRoute = {
    urlCommands: {
      cxRoute: 'category',
      params: { code: 'dog-food' },
    },
    query: ':relevance:allCategories:dog-food:age:Senior'
  };

  puppyRoute = {
    urlCommands: {
      cxRoute: 'category',
      params: { code: 'dog-food' }
    },
    query: ':relevance:allCategories:dog-food:age:Cachorro'
  };

  adultRoute = {
    urlCommands: {
      cxRoute: 'category',
      params: { code: 'dog-food' },
    },
    query: ':relevance:allCategories:dog-food:age:Adulto'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: any, private changeDetector: ChangeDetectorRef) {}

  getShowcaseItems(): any {
    return [{
        title: 'common.homeAnimations.showcase.tabOne.title',
        subtitle: 'common.homeAnimations.showcase.tabOne.subtitle',
        tab: 'common.homeAnimations.showcase.tabOne.tab',
        description: 'common.homeAnimations.showcase.tabOne.description',
        active: false,
        imageUrl: '/assets/images/costal-cachorro.png',
        cssClasses: 'maka-blue-tab'
      },
      {
        title: 'common.homeAnimations.showcase.tabTwo.title',
        subtitle: 'common.homeAnimations.showcase.tabTwo.subtitle',
        tab: 'common.homeAnimations.showcase.tabTwo.tab',
        description: 'common.homeAnimations.showcase.tabTwo.description',
        active: true,
        imageUrl: '/assets/images/costal-adulto.png',
        cssClasses: 'maka-red-tab'
      },
      {
        title: 'common.homeAnimations.showcase.tabThree.title',
        subtitle: 'common.homeAnimations.showcase.tabThree.subtitle',
        tab: 'common.homeAnimations.showcase.tabThree.tab',
        description: 'common.homeAnimations.showcase.tabThree.description',
        active: false,
        imageUrl: '/assets/images/costal-senior.png',
        cssClasses: 'maka-orange-tab'
      }
    ];
  }


  enableScrollTrigger() {
    // Frames - Animation 3d metadata
    const frames = 36 - 1; // total frames of 360 image less one
    const frameWidth = 369.2; // width of image / total frames
    const bgPositionTotal = frames * frameWidth;

    const journey = gsap.timeline()
    // Zoom out text
    .fromTo('.journey-text',
      50,
      { scale: 1 },
      { scale: 0.7, ease: ExpoScaleEase.config(1, 0.2) }
    )
    // Hide Red background
    .to('.product-journey-background',
      3,
      { opacity: 0,
        onComplete: () => {
          this.zoomOutDone = true;
          this.changeDetector.detectChanges();
        },
        onReverseComplete: () => {
          this.zoomOutDone = false;
          this.changeDetector.detectChanges();
        }
      }
    )
    // Turn text to red ($maka-red color)
    .to('.journey-text', 3, { color: '#b11f2a' }, '-=3')
    // Show 360 image
    .to('.image-360', 3, { opacity: 1 }, '-=3')
    // 360 image rotation (move image to the left to simulate animation)
    .to( '.image-360', 100, {
        x: `-${bgPositionTotal}`,
        ease: SteppedEase.config(frames)
      })
    // pause
    .to({}, {duration: 50})
    // Move text away
    .to('.journey-text', 100, { right: '100%' })
    // Move image away (at the same time)
    .to('.journey-360-wrapper', 100, { right: '100%' }, '-=100')
    // Show product showcase (at the same time)
    .from('.product-showcase', 100,
      {
        left: '100%',
        onComplete: () => {
          this.showcaseSlideDone = true;
          this.changeDetector.detectChanges();
        },
        onReverseComplete: () => {
          this.showcaseSlideDone = false;
          this.changeDetector.detectChanges();
        }
      }, '-=100')
    // pause
    .to({}, {duration: 100})
    .to('.product-showcase', 30, { opacity: 0 });

    ScrollTrigger.create({
      animation: journey,
      id: 'journeyTrigger',
      trigger: '.product-journey',
      start: 'top top',
      scrub: true,
      pin: true,
      pinSpacing: true,
      refreshPriority: 3, // this establishes the order of scroll triggering refreshing
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.enableScrollTrigger();
      this.display = true;
    }
  }


}
