import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { BreakpointService, BREAKPOINT } from '@spartacus/storefront';

import { MakaHeaderAnimationService } from './maka-header-animation.service';

import createSpy = jasmine.createSpy;

class MockBreakpointService {
  get breakpoint$(): Observable<BREAKPOINT> {
    return of();
  }
  get breakpoints(): BREAKPOINT[] {
    return [
      BREAKPOINT.xs,
      BREAKPOINT.sm,
      BREAKPOINT.md,
      BREAKPOINT.lg,
      BREAKPOINT.xl,
    ];
  }
}

describe('MakaHeaderAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      { provide: BreakpointService, useClass: MockBreakpointService },
    ],
  }));

  it('should be created', () => {
    const service: MakaHeaderAnimationService = TestBed.get(MakaHeaderAnimationService);
    expect(service).toBeTruthy();
  });

  it('should validate initial properties', () => {
    const service: MakaHeaderAnimationService = TestBed.get(MakaHeaderAnimationService);
    expect(service.myAccountMenuOpened).toEqual(false);
    expect(service.navMenuOpened).toEqual(false);
    expect(service.myAccountMenuHeight).toEqual('450');
    expect(service.isDesktop).toEqual(false);
  });

  describe('init method mobile', () => {
    let breakpointService: MockBreakpointService;
    beforeEach(() => {
      breakpointService = TestBed.get(BreakpointService);
      spyOnProperty(breakpointService, 'breakpoint$').and.returnValue(
        of(BREAKPOINT.xs)
      );
    });

    it('should validate init method mobile', () => {
      const service: MakaHeaderAnimationService = TestBed.get(MakaHeaderAnimationService);
      service.init();
      breakpointService.breakpoint$.subscribe(breakpoint => {
        expect(service.isDesktop).toEqual(false);
      });
    });

  });

  describe('init method desktop', () => {
    let breakpointService: MockBreakpointService;
    let animationService: MakaHeaderAnimationService;
    beforeEach(() => {
      breakpointService = TestBed.get(BreakpointService);
      animationService = TestBed.get(MakaHeaderAnimationService);
      spyOn(animationService, 'toggleMyAccountMenu');
      spyOnProperty(breakpointService, 'breakpoint$').and.returnValue(
        of(BREAKPOINT.xl)
      );
    });

    it('should validate init method desktop', () => {
      animationService.init();
      breakpointService.breakpoint$.subscribe(breakpoint => {
        expect(animationService.isDesktop).toEqual(true);
      });
    });

    it('should validate init method desktop with opened menu', () => {
      animationService.myAccountMenuOpened = true;
      animationService.init();
      breakpointService.breakpoint$.subscribe(breakpoint => {
        expect(animationService.toggleMyAccountMenu).toHaveBeenCalled();
      });
    });
  });
});
