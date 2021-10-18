import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoutingService, UserService, GlobalMessageService, PageType, RouterState } from '@spartacus/core';
import { Observable, of } from 'rxjs';

import { MakaAccessSiteGuard } from './maka-access-site.guard';
import { MakaUser } from '../../../core/models/maka-user.model';
import { MakaBaseSiteService } from '../../../shared/services/maka-base-site/maka-base-site.service';
import { EnvironmentType } from '../../models/maka-globals-vars.model';

import createSpy = jasmine.createSpy;

const mockRoutingService = {
  goByUrl: () => {},

  getRouterState: () => {}
};

class MockUserService {
  get(): Observable<MakaUser> {
    return of();
  }
}

class MockGlobalMessageService {
  add() {}
}

class MockMakaBaseSiteService {
  getActive() {
    return of({});
  }

  getBaseSiteData() {
    return of({});
  }
}

describe('MakaAccessSiteGuard', () => {
  let makaAccessSiteGuard: MakaAccessSiteGuard;
  let routingService: RoutingService;
  let userService: UserService;
  let globalMessageService: GlobalMessageService;
  let makaBaseSiteService: MakaBaseSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RoutingService,
          useValue: mockRoutingService,
        },
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: GlobalMessageService,
          useClass: MockGlobalMessageService,
        },
        {
          provide: MakaBaseSiteService,
          useClass: MockMakaBaseSiteService,
        },
      ],
      imports: [RouterTestingModule],
    });

    makaAccessSiteGuard = TestBed.inject(MakaAccessSiteGuard);
    routingService = TestBed.inject(RoutingService);
    userService = TestBed.inject(UserService);
    globalMessageService = TestBed.inject(GlobalMessageService);
    makaBaseSiteService = TestBed.inject(MakaBaseSiteService);
  });

  it('should return true for partner in partners site', done => {
    spyOn(userService, 'get').and.returnValue(
      of({
        uid: 'test',
        isAssociate: true,
        firstName: 'First',
        lastName: 'Last'
      })
    );

    spyOn(routingService, 'getRouterState').and.returnValue(
      of({
        navigationId: 1,
        state: {
          url: 'maka-partners',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: true
        },
        nextState: {
          url: 'maka-partners',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: false
        }
      })
    );

    spyOn(makaBaseSiteService, 'getActive').and.returnValue(
      of({
        baseSites: [{
          uid: 'maka-store',
          countries: [],
          languages: [],
          environmentType: EnvironmentType.DEVELOPMENT
        }]
      })
    );

    makaAccessSiteGuard.canActivate().subscribe((res) => {
      expect(res).toEqual(true);
      done();
    }).unsubscribe();
  });

  it('should return false for client in partners site', done => {
    spyOn(userService, 'get').and.returnValue(
      of({
        uid: 'test',
        isAssociate: false,
        firstName: 'First',
        lastName: 'Last'
      })
    );

    spyOn(makaBaseSiteService, 'getActive').and.returnValue(
      of({
        baseSites: [{
          uid: 'maka-store',
          countries: [],
          languages: [],
          environmentType: EnvironmentType.DEVELOPMENT
        }]
      })
    );

    spyOn(routingService, 'getRouterState').and.returnValue(
      of({
        state: {
          url: 'maka-partners',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: true
        },
        navigationId: 1,
        nextState: {
          url: 'maka-partners',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: true
        }
      })
    );

    makaAccessSiteGuard.canActivate().subscribe((res) => {
      expect(res).toEqual(false);
      done();
    }).unsubscribe();
  });

  it('should return true for client in client site ', done => {
    spyOn(userService, 'get').and.returnValue(
      of({
        uid: 'test',
        isAssociate: false,
        firstName: 'First',
        lastName: 'Last'
      })
    );

    spyOn(routingService, 'getRouterState').and.returnValue(
      of({
        state: {
          url: 'maka-partners',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: true
        },
        navigationId: 1,
        nextState: {
          url: 'maka-store',
          queryParams: {},
          params: {},
          context: {
            id: 'homepage',
            type: PageType.CONTENT_PAGE
          },
          cmsRequired: true
        }
      })
    );

    makaAccessSiteGuard.canActivate().subscribe((res) => {
      expect(res).toEqual(true);
      done();
    }).unsubscribe();
  });

  it('is public page should return true', () => {
    const routerState = {
      state: {
        url: 'maka-partners/login',
        queryParams: {},
        params: {},
        context: {
          id: 'homepage',
          type: PageType.CONTENT_PAGE
        },
        cmsRequired: true
      },
      navigationId: 1,
      nextState: {
        url: 'maka-store/login',
        queryParams: {},
        params: {},
        context: {
          id: 'homepage',
          type: PageType.CONTENT_PAGE
        },
        cmsRequired: true
      }
    };
    expect(makaAccessSiteGuard.isPublicPage(routerState)).toEqual(true);
  });

  it('is public page should return false', () => {
    const routerState = {
      state: {
        url: 'maka-partners',
        queryParams: {},
        params: {},
        context: {
          id: 'homepage',
          type: PageType.CONTENT_PAGE
        },
        cmsRequired: true
      },
      navigationId: 1,
      nextState: {
        url: 'maka-store/something',
        queryParams: {},
        params: {},
        context: {
          id: 'homepage',
          type: PageType.CONTENT_PAGE
        },
        cmsRequired: true
      }
    };
    expect(makaAccessSiteGuard.isPublicPage(routerState)).toEqual(false);
  });

});
