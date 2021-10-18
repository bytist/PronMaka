import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  OnDestroy,
  Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MakaPlateService } from './maka-plate.service';

@Component({
  selector: 'app-maka-plate',
  templateUrl: './maka-plate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaPlateComponent implements OnDestroy {

  loadedImages = 0; // count of animation images that are loaded (flying croquettes and plate, 2 imgs max)
  plateTimeline: any;
  unsubscribe$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: any, private makaPlateService: MakaPlateService) {}

  enableScrollTrigger() {
    this.makaPlateService.finalTopCoordinate$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((yCoordinate) => {
      if (this.plateTimeline) {
        this.plateTimeline.pause(0).kill();
        ScrollTrigger.getById('plateTrigger').kill();
      }

      this.plateTimeline = gsap.timeline({
        scrollTrigger: {
          id: 'plateTrigger',
          trigger: '.maka-plate',
          start: 'top top',
          scrub: true,
          pin: true,
          pinSpacing: true,
          refreshPriority: 4, // this establishes the order of scroll trigger refreshing
        }
      });

      this.plateTimeline.to('.flying', {
        duration: 1,
        top: yCoordinate
      });

    });
  }

  loadImage() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadedImages += 1;
      if (this.loadedImages === 2) {
        this.makaPlateService.setFinalTopCoordinate();
        this.enableScrollTrigger();
      }
    }
  }

  ngOnDestroy() {
    if (this.plateTimeline) {
      this.plateTimeline.pause(0).kill();
      ScrollTrigger.getById('plateTrigger').kill();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
