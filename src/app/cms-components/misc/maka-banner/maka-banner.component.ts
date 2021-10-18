import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CmsComponentData } from '@spartacus/storefront';

import { CmsMakaBanner, CMSMakaBannerAlignment } from '../../../core/models/maka-cms.model';
import { OccConfig } from '@spartacus/core';

@Component({
  selector: 'app-maka-banner',
  templateUrl: './maka-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaBannerComponent {
  bannerContentAlignment = CMSMakaBannerAlignment;

  constructor(
    public component: CmsComponentData<CmsMakaBanner>,
    private config: OccConfig,
  ) {}

  hasHorizontalAlignment(contentAlignment) {
    return (contentAlignment === this.bannerContentAlignment.RIGHT || contentAlignment === this.bannerContentAlignment.LEFT);
  }

  getBgImageUrl(url) {
    if (!url) {
      return false;
    }
    return `url("${this.config.backend.occ.baseUrl}${url}")`;
  }
}
