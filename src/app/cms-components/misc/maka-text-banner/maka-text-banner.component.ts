import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-maka-text-banner',
  templateUrl: './maka-text-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaTextBannerComponent {

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  imageUrl: string;

  @Input()
  imageAlt: string;
}
