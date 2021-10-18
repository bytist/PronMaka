import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  Input,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Breadcrumb, I18nTestingModule } from '@spartacus/core';
import { of } from 'rxjs';
import { ICON_TYPE, KeyboardFocusModule, FacetList, FacetService } from '@spartacus/storefront';

import { MakaActiveFacetsComponent } from './maka-active-facets.component';

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}
class MockFacetService {
  getLinkParams() {}
}

const mockFacetList: FacetList = {
  facets: [{ name: 'facet-A' }],
  activeFacets: [{ facetName: 'facet-B' }, { facetName: 'facet-C' }],
};

describe('MakaActiveFacetsComponent', () => {
  let component: MakaActiveFacetsComponent;
  let fixture: ComponentFixture<MakaActiveFacetsComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, RouterTestingModule, KeyboardFocusModule],
      declarations: [MakaActiveFacetsComponent, MockCxIconComponent],
      providers: [{ provide: FacetService, useClass: MockFacetService }],
    })
      .overrideComponent(MakaActiveFacetsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaActiveFacetsComponent);
    element = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render h4 when there are no active facets', () => {
    component.facetList$ = null;
    fixture.detectChanges();
    const header = element.queryAll(By.css('h4'));
    expect(header.length).toBeFalsy();
  });

  it('should not render anchor links when there are no active facets', () => {
    component.facetList$ = null;
    fixture.detectChanges();
    const header = element.queryAll(By.css('a'));
    expect(header.length).toEqual(0);
  });

  it('should render h4 when there are active facets', () => {
    component.facetList$ = of(mockFacetList);
    fixture.detectChanges();
    const header = element.queryAll(By.css('h4'));
    expect(header).toBeTruthy();
  });

  it('should render an anchor links for every active facets', () => {
    component.facetList$ = of(mockFacetList);
    fixture.detectChanges();
    const header = element.queryAll(By.css('a'));
    expect(header.length).toEqual(3);
  });

  it('should return focus key when there is no matching facet', () => {
    const key = component.getFocusKey(
      { facets: [{ values: [{ name: 'anyNameButNotActive' }] }] } as FacetList,
      { facetValueName: 'activeFacet' } as Breadcrumb
    );
    expect(key).toEqual('activeFacet');
  });

  it('should not return focus key when there is a matching facet', () => {
    const key = component.getFocusKey(
      { facets: [{ values: [{ name: 'activeFacet' }] }] } as FacetList,
      { facetValueName: 'activeFacet' } as Breadcrumb
    );
    expect(key).toEqual('');
  });
});
