import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  TabParagraphContainerComponent,
} from '@spartacus/storefront';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cx-tab-paragraph-container',
  templateUrl: './maka-tab-paragraph-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaTabParagraphContainerComponent extends TabParagraphContainerComponent {

  select(tabNum: number): void {
    this.activeTabNum = tabNum;
    // delay for tab to be visible before scroll trigger is refreshed
    setTimeout(() => ScrollTrigger.refresh(), 500);
  }
}
