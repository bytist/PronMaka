import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActiveFacetsComponent, FacetService } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-active-facets',
  templateUrl: './maka-active-facets.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MakaActiveFacetsComponent extends ActiveFacetsComponent {

  @Input()
  inDialog = false;

  constructor(protected facetService: FacetService) {
    super(facetService);
  }
}
