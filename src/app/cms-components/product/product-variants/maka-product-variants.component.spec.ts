import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Product,
  RoutingService,
  UrlCommandRoute,
  UrlCommands,
  VariantType,
  I18nTestingModule,
  BaseOption,
} from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { NavigationExtras } from '@angular/router';

import { MakaProductVariantsComponent } from './maka-product-variants.component';

const mockProduct: Product = {
  name: 'mockProduct',
  code: 'code2',
  baseOptions: [
    {
      variantType: VariantType.STYLE,
      options: [
        {
          code: 'mock_code_3',
          variantOptionQualifiers: [{ value: 'test111' }],
        },
        { code: 'code2', variantOptionQualifiers: [{ value: 'test222' }] },
      ],
      selected: { code: 'test222' },
    },
  ],
  variantOptions: [{ code: 'mock_code_3' }, { code: 'mock_code_4' }],
};

class MockRoutingService {
  go(
    commands: any[] | UrlCommands,
    query?: object,
    extras?: NavigationExtras
  ): void {}
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(options: UrlCommandRoute): string {
    return options.cxRoute;
  }
}

class MockCurrentProductService {
  getProduct(): Observable<Product> {
    return of(mockProduct);
  }
}

@Component({
  selector: 'app-cx-variant-style-selector',
  template: '',
})
class MockCxStyleSelectorComponent {
  @Input() product: Product;
  @Input() variants: BaseOption;
}

@Component({
  selector: 'app-cx-variant-size-selector',
  template: '',
})
class MockCxSizeSelectorComponent {
  @Input() product: Product;
  @Input() variants: BaseOption;
}

@Component({
  selector: 'app-cx-variant-color-selector',
  template: '',
})
class MockCxColorSelectorComponent {
  @Input() product: Product;
  @Input() variants: BaseOption;
}

@Component({
  selector: 'app-maka-product-variants',
  template: '',
})
class MockMakaWeightSelectorComponent {
  @Input() product: Product;
  @Input() variants: BaseOption;
}

describe('MakaProductVariantSelectorComponent', () => {
  let component: MakaProductVariantsComponent;
  let fixture: ComponentFixture<MakaProductVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MakaProductVariantsComponent,
        MockUrlPipe,
        MockCxStyleSelectorComponent,
        MockCxSizeSelectorComponent,
        MockCxColorSelectorComponent,
        MockMakaWeightSelectorComponent
      ],
      imports: [RouterTestingModule, I18nTestingModule],
      providers: [
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: CurrentProductService,
          useClass: MockCurrentProductService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaProductVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get variant list', () => {
    component.ngOnInit();
    component.product$.subscribe();

    expect(Object.keys(component.variants).length).toEqual(
      mockProduct.baseOptions.length
    );

    expect(Object.keys(component.variants)[0]).toEqual(VariantType.STYLE);
  });
});
