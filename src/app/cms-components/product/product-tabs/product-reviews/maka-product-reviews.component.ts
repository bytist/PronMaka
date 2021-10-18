import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ProductReviewsComponent } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-product-reviews',
  templateUrl: './maka-product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaProductReviewsComponent extends ProductReviewsComponent {
}
