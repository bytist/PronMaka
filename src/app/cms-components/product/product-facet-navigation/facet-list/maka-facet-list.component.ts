import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2
} from '@angular/core';
import { FacetListComponent, ProductListComponentService, FacetService } from '@spartacus/storefront';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cx-facet-list',
  templateUrl: './maka-facet-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaFacetListComponent extends FacetListComponent {

  constructor(
    protected facetService: FacetService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
    protected productListComponentService: ProductListComponentService
  ) {
    super(facetService, elementRef, renderer);
  }

  model$ = this.productListComponentService.model$;
}
