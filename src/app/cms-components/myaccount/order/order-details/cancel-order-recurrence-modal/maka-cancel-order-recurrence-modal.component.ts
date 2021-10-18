import {Component, Input} from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-cancel-order-recurrence-modal',
  templateUrl: './maka-cancel-order-recurrence-modal.component.html'
})
export class MakaCancelOrderRecurrenceModalComponent {
  @Input() onCancelOrder: () => {};
  @Input() dismissModal: () => {};
  iconTypes = ICON_TYPE;

  constructor() {}
}
