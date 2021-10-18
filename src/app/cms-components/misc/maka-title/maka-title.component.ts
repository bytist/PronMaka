import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { CmsComponentData } from '@spartacus/storefront';

import { CmsMakaTitleComponent } from '../../../core/models/maka-cms.model';

@Component({
  selector: 'app-maka-title',
  templateUrl: './maka-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaTitleComponent {

  constructor(public component: CmsComponentData<CmsMakaTitleComponent>) {}

}
