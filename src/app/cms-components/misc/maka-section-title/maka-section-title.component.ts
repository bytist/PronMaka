import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-maka-section-title',
  templateUrl: './maka-section-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaSectionTitleComponent {

  @Input()
  title: string;
}
