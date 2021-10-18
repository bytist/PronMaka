import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  I18nTestingModule,
  ProductReviewService,
  Product,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { ItemCounterModule, FormErrorsModule, CurrentProductService } from '@spartacus/storefront';

import { MakaProductReviewsComponent } from './maka-product-reviews.component';

const productCode = '123';
const product = { code: productCode, text: 'bla' };
const reviews = [
  { comment: 'bla1', headline: '1', alias: 'test1' },
  { comment: 'bla2', headline: '2', alias: 'test2' },
];

class MockProductReviewService {
  getByProductCode(): Observable<any> {
    return of(reviews);
  }
  add() {}
}

@Component({
  selector: 'cx-star-rating',
  template: '',
})
class MockStarRatingComponent {
  @Input() rating;
  @Input() disabled;
}

const mockProduct: Product = { name: 'mockProduct' };

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of(mockProduct);
  }
}

describe('MakaProductReviewsComponent in product', () => {
  let productReviewsComponent: MakaProductReviewsComponent;
  let fixture: ComponentFixture<MakaProductReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ItemCounterModule,
        I18nTestingModule,
        FormErrorsModule,
      ],
      providers: [
        {
          provide: ProductReviewService,
          useClass: MockProductReviewService,
        },
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
      ],
      declarations: [MockStarRatingComponent, MakaProductReviewsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaProductReviewsComponent);
    productReviewsComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(productReviewsComponent).toBeTruthy();
  });

  it('from get reviews by product code', () => {
    expect(productReviewsComponent.reviews$).toBeTruthy();
    productReviewsComponent.reviews$.subscribe((result) => {
      expect(result).toEqual(reviews);
    });
  });

  it('should contain a form object for the review submission form, after init()', () => {
    const props = ['comment', 'title', 'rating', 'reviewerName'];

    props.forEach((prop) => {
      expect(productReviewsComponent.reviewForm.controls[prop]).toBeDefined();
    });
  });

  describe('Logic on displaying review submission form', () => {
    it('should be initiated to hide the form', () => {
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });

    it('should display form on initiateWriteReview()', () => {
      productReviewsComponent.initiateWriteReview();
      expect(productReviewsComponent.isWritingReview).toBe(true);
    });

    it('should hide form on cancelWriteReview()', () => {
      productReviewsComponent.cancelWriteReview();
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });

    it('should hide form on submitReview()', () => {
      productReviewsComponent.submitReview(product);
      expect(productReviewsComponent.isWritingReview).toBe(false);
    });
  });

  describe('Overall rating display', () => {
    it('should display rating component when rating is available', () => {
      mockProduct.averageRating = 4.5;
      fixture = TestBed.createComponent(MakaProductReviewsComponent);
      fixture.detectChanges();
      expect(
        fixture.debugElement.nativeElement.querySelector(
          '.header> div cx-star-rating'
        )
      ).not.toBeNull();
    });

    it('should not display rating component when rating is unavailable', () => {
      mockProduct.averageRating = undefined;
      fixture = TestBed.createComponent(MakaProductReviewsComponent);
      fixture.detectChanges();
      expect(
        fixture.debugElement.nativeElement.querySelector(
          '.header>cx-star-rating'
        )
      ).toBeNull();
    });

    it('should display noReviews when rating is unavailable', () => {
      mockProduct.averageRating = undefined;
      fixture = TestBed.createComponent(MakaProductReviewsComponent);
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.innerText).toContain(
        'productDetails.noReviews'
      );
    });
  });
});
