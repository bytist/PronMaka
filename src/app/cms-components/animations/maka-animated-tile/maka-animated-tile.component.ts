import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { RoutingService, UrlCommands } from '@spartacus/core';

@Component({
  selector: 'app-maka-animated-tile',
  templateUrl: './maka-animated-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaAnimatedTileComponent {
  @Input() imageUrl: string;
  @Input() spinnerColorCSSClass: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() ctaText: string;
  @Input() ctaRoute: { urlCommands: UrlCommands, query?: any };

  constructor(private routingService: RoutingService) {}

  navigate() {
    this.routingService.go(this.ctaRoute.urlCommands, { query: this.ctaRoute.query });
  }
}
