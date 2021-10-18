import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
  RoutingService,
  UrlCommands,
  Product,
  ProductService,
  VariantType,
  BaseOption
} from '@spartacus/core';
import { NavigationExtras } from '@angular/router';
import { Observable, of } from 'rxjs';

import { MakaVariantWeightSelectorComponent } from './maka-variant-weight-selector.component';
import { MakaVariantQualifier } from '../../../../core/models/maka-product.model';

class MockRoutingService {
  go(
    commands: any[] | UrlCommands,
    query?: object,
    extras?: NavigationExtras
  ): void {}
}

const mockVariant: BaseOption = {
  selected: {
    code: 'test',
    variantOptionQualifiers: [
      {
        value: '123',
        image: {
          url: 'http://test1-thumbnail.com',
        },
      },
    ],
  },
  options: [],
  variantType: VariantType.SIZE,
};

class MockProductService {
  get(): Observable<Product> {
    return of();
  }
}
describe('MakaVariantWeightSelectorComponent', () => {
  let component: MakaVariantWeightSelectorComponent;
  let fixture: ComponentFixture<MakaVariantWeightSelectorComponent>;
  let mockRoutingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MakaVariantWeightSelectorComponent],
      imports: [RouterTestingModule, I18nTestingModule],
      providers: [
        { provide: RoutingService, useClass: MockRoutingService },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaVariantWeightSelectorComponent);
    mockRoutingService = TestBed.inject(RoutingService);
    component = fixture.componentInstance;
    component.variants = mockVariant;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send emit', () => {
    spyOn(component, 'changeWeight').and.stub();

    component.changeWeight('code', 'name');

    expect(component.changeWeight).toHaveBeenCalledWith('code', 'name');
  });

  it('should test unmatched qualifiers', () => {
    expect(component.getVariantOptionValue([])).toEqual('');
  });

  it('should test qualifiers', () => {
    const qualifiers = [
      { qualifier: MakaVariantQualifier.WEIGHT, value: '1.0' }
    ];
    expect(component.getVariantOptionValue(qualifiers)).toEqual('1');
  });

  it('should test changeWeight()', () => {
    spyOn(mockRoutingService, 'go').and.stub();
    component.changeWeight('1', 'test');
    expect(component.selectedCode).toEqual('1');
    expect(mockRoutingService.go).toHaveBeenCalled();
  });

});
