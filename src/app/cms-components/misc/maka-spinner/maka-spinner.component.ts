import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';


@Component({
  selector: 'app-maka-spinner',
  templateUrl: './maka-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaSpinnerComponent {
  @Input() fullHeight = true;
}
