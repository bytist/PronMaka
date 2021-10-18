import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { OutletModule, PageComponentModule } from '@spartacus/storefront';

import { MakaTabParagraphContainerComponent } from './maka-tab-paragraph-container.component';

@NgModule({
  imports: [CommonModule, PageComponentModule, OutletModule, I18nModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CMSTabParagraphContainer: {
          component: MakaTabParagraphContainerComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaTabParagraphContainerComponent],
  entryComponents: [MakaTabParagraphContainerComponent],
  exports: [MakaTabParagraphContainerComponent],
})
export class MakaTabParagraphContainerModule {}
