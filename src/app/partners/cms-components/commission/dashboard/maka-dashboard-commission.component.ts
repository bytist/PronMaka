import {
  Component,
} from '@angular/core';
import { Observable } from 'rxjs';

import { MakaAssociateService } from '../../../../shared/services/maka-associate/maka-associate.service';
import { AssociateDashboardCommission } from '../../../../core/models/maka-associate-dashboard-commission.model';

@Component({
  selector: 'app-maka-dashboard-commission',
  templateUrl: './maka-dashboard-commission.component.html'
})
export class MakaDashboardCommissionComponent {

  dashboardCommission$: Observable<AssociateDashboardCommission> = this.makaAssociateService.forecastAssociateCommission();

  constructor(private makaAssociateService: MakaAssociateService) {}
}
