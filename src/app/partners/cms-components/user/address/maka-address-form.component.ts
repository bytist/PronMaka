import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { UserAddressService, UserService, Region, Title } from '@spartacus/core';
import { sortTitles } from '@spartacus/storefront';

import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-maka-partner-address-form',
  templateUrl: './maka-address-form.component.html'
})
export class MakaPartnerAddressFormComponent implements OnInit {

  regions$: Observable<Region[]>;
  titles$: Observable<Title[]>;

  @Input()
  parentForm: FormGroup;

  constructor(
    protected userAddressService: UserAddressService,
    protected userService: UserService
  ) {}

  compareTitle(a: any, b: any) {
    return a.code === b.code;
  }

  ngOnInit(): void {
    this.titles$ = this.userService.getTitles().pipe(
      tap((titles) => {
        if (Object.keys(titles).length === 0) {
          this.userService.loadTitles();
        }
      }),
      map((titles) => {
        return titles.sort(sortTitles);
      })
    );

    this.regions$ = this.userAddressService.getRegions(environment.defaultCountry.isocode).pipe(
      tap((regions: Region[]) => {
        const regionControl = this.parentForm.get('addressForm.region.isocode');
        if (regions && regions.length > 0 && !this.parentForm.disabled) {
          regionControl.enable();
        } else {
          regionControl.disable();
        }
      })
    );
  }
}

