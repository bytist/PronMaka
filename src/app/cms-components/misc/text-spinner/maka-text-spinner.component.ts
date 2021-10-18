import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-maka-text-spinner',
  templateUrl: './maka-text-spinner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaTextSpinnerComponent {

  @Input() cssClasses: string;
}
