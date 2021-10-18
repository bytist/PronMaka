import { from, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { MakaBaseSiteService } from '../maka-base-site/maka-base-site.service';
import { EnvironmentType, GlobalRuntimeVars } from '../../../core/models/maka-globals-vars.model';

@Injectable({
  providedIn: 'root',
})
export class MakaEnvironmentService {
  jsonEnvironmentConfig$: Observable<GlobalRuntimeVars>;
  environmentType: EnvironmentType;

  constructor(
    private makaBaseSiteService: MakaBaseSiteService
  ) {}

  getEnvironmentConfig(): Observable<any> {
    if (!this.jsonEnvironmentConfig$ || !this.environmentType) {
      this.jsonEnvironmentConfig$ = this.makaBaseSiteService.getEnvironment()
        .pipe(
          switchMap((environmentType: EnvironmentType) => {

            this.environmentType = environmentType; // We will store type from response, to make sure refresh if undefined
            const environmentTypeLocal = (!environmentType) ? EnvironmentType.STAGING : environmentType;

            return from(import(`../../../../assets/configuration/environment.runtime.${environmentTypeLocal}.json`)
              .then(module => module.default)
            );
          }),
          shareReplay(1) // cache size = 1
        );
    }
    return this.jsonEnvironmentConfig$;
  }
}
