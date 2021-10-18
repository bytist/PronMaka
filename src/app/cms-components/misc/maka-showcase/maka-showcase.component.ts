import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { MakaShowcaseTab } from '../../../core/models/maka-misc.model';

@Component({
  selector: 'app-maka-showcase',
  templateUrl: './maka-showcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('hideAndShowContent', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('350ms', style({ transform: 'translateY(200%)' }))
      ])
    ])
  ]
})
export class MakaShowcaseComponent {

  @Input() items: MakaShowcaseTab[];
  @Input() scrollable = false;

  constructor() {}

  selectItem(event: any, item: any) {
    event.preventDefault();
    this.items = this.items.map((tabItem: MakaShowcaseTab) => {
      tabItem.active = false;
      return tabItem;
    });

    item.active = true;
  }
}
