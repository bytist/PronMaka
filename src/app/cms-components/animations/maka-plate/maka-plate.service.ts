import { PLATFORM_ID, Injectable, Inject, OnDestroy } from '@angular/core';
import { WindowRef } from '@spartacus/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MakaPlateService implements OnDestroy {

  finalTopCoordinate: number;
  finalTopCoordinate$: BehaviorSubject<number>;
  unsubscribe$ = new Subject<void>();

  constructor(private windowRef: WindowRef, @Inject(PLATFORM_ID) private platformId: any) {
    this.finalTopCoordinate$ = new BehaviorSubject(this.finalTopCoordinate);

    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.resize$
      .pipe(delay(500), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.finalTopCoordinate = null;
        this.setFinalTopCoordinate();
      });
    }
  }

  setFinalTopCoordinate() {
    if (!this.finalTopCoordinate) {
      const plateImage = document.querySelector('.plate');
      const flyingImage = document.querySelector('.flying');
      if (plateImage && flyingImage) {
        // half of plate image
        const finalY = plateImage.getBoundingClientRect().top + (plateImage.getBoundingClientRect().height / 3);
        // flyingImage.top + flyingImage.height = finalY
        this.finalTopCoordinate = finalY - flyingImage.getBoundingClientRect().height;
        this.finalTopCoordinate$.next(this.finalTopCoordinate);
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
