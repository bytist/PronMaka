import { Injectable } from '@angular/core';
import {
  Observable,
  of
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  OccConfig,
  OccEndpointsService
} from '@spartacus/core';
import {
  shareReplay,
  catchError,
  map
} from 'rxjs/operators';

import {
  MakaBaseSites,
  MakaBaseSite
} from 'src/app/core/models/maka-site.model';
import { EnvironmentType } from 'src/app/core/models/maka-globals-vars.model';

const PARTNERS_SITE_ID = 'maka-partners';

@Injectable({
  providedIn: 'root'
})
export class MakaBaseSiteService {

  readonly baseSiteEndpoint = '/rest/v2/basesites?active=true&showExternalSites=true&fields=FULL';
  activeBaseSitesCache$: Observable<MakaBaseSites>;

  constructor(
    private http: HttpClient,
    private config: OccConfig,
    private occEndpointsService: OccEndpointsService
  ) {}

  getActive(): Observable<MakaBaseSites> {
    const url = this.config.backend.occ.baseUrl + this.baseSiteEndpoint;

    if (!this.activeBaseSitesCache$) {
      this.activeBaseSitesCache$ = this.http.get<MakaBaseSites>(url).pipe(
        shareReplay({
          bufferSize: 1, // cache size = 1
          refCount: true
        }),
        catchError(err => of(undefined))
      );
    }
    return this.activeBaseSitesCache$;
  }

  getBaseSiteData(): Observable<MakaBaseSite> {
    const activeSite = this.occEndpointsService.getBaseEndpoint().split('/').pop();

    return this.getActive().pipe(
      map((data: MakaBaseSites) => {
        return data.baseSites.find(site => site.uid === activeSite);
      })
    );
  }

  // TODO: This might be removed if we do not need specific configuration per environment
  getEnvironment(): Observable<EnvironmentType> {
    return this.getActive().pipe(
      map((data: MakaBaseSites) => {
        if (data) {
          return data.baseSites[0].environmentType;
        }
        return null;
      }));
  }

  isPartnersSite(): Observable<boolean> {
    return this.getBaseSiteData().pipe(
      map((site: MakaBaseSite) => {
        return site.uid === PARTNERS_SITE_ID;
    }));
  }
}
