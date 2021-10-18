import { Component } from '@angular/core';

import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';

@Component({
  selector: 'app-maka-partner-update-profile',
  templateUrl: './maka-update-profile.component.html',
})
export class MakaPartnerUpdateProfileComponent {

  partner$ = this.makaAssociateService.getCurrentAssociate();

  constructor(private makaAssociateService: MakaAssociateService) {}
}
