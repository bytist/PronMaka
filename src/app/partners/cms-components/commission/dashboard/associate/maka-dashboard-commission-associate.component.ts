import {
  Component,
  Input
} from '@angular/core';
import { Price } from '@spartacus/core';

import { AssociateDashboardCommissionAccount } from '../../../../../core/models/maka-associate-dashboard-commission.model';

@Component({
  selector: 'app-maka-dashboard-commission-associate',
  templateUrl: './maka-dashboard-commission-associate.component.html'
})
export class MakaDashboardCommissionAssociateComponent {
  @Input() partner: AssociateDashboardCommissionAccount;
  @Input() cutOffDate: Date;
  @Input() dueDate: Date;
  @Input() total: Price;
}
