import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  I18nTestingModule,
  Product
} from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import {
  Observable,
  of
} from 'rxjs';

import { MakaProductAttributesComponent } from './maka-product-attributes.component';

const mockProduct: Product = { name: 'mockProduct' };

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of(mockProduct);
  }
}

describe('ProductAttributesComponent in product', () => {
  let productAttributesComponent: MakaProductAttributesComponent;
  let fixture: ComponentFixture<MakaProductAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [MakaProductAttributesComponent],
      providers: [
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaProductAttributesComponent);
    productAttributesComponent = fixture.componentInstance;
  });

  it('should create', () => {
    expect(productAttributesComponent).toBeTruthy();
  });
});

