import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CmsComponentData } from '@spartacus/storefront';

import { CmsMakaVideoComponent } from '../../../core/models/maka-cms.model';

@Component({
  selector: 'app-maka-video',
  templateUrl: './maka-video.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaVideoComponent {

  constructor(public component: CmsComponentData<CmsMakaVideoComponent>,
              private domSanitizer: DomSanitizer) {}

  isVimeo(url: string): boolean {
    return url ? url.includes('/player.vimeo.com/') : false;
  }

  trustUrl(url: string) {
    const videoUrl = !this.isVimeo(url) ? `${url}?rel=0` : url; // rel=0 ensures related videos belong to owner's channel
    return this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
}
