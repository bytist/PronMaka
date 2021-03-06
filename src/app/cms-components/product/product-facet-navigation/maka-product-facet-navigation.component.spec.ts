import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule } from '@spartacus/core';
import { of } from 'rxjs';
import { BreakpointService, ICON_TYPE } from '@spartacus/storefront';

import { MakaProductFacetNavigationComponent } from './maka-product-facet-navigation.component';

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}
@Component({
  selector: 'cx-active-facets',
  template: '',
})
class MockActiveFacetsComponent {
  @Input() facetList;
}
@Component({
  selector: 'cx-facet-list',
  template: '',
})
class MockFacetListComponent {
  @Input() isDialog;
  @Output() closeDialog = new EventEmitter();
}

class MockBreakpointService {
  get breakpoint$() {
    return of({});
  }
}

describe('MakaProductFacetNavigationComponent', () => {
  let component: MakaProductFacetNavigationComponent;
  let fixture: ComponentFixture<MakaProductFacetNavigationComponent>;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        MakaProductFacetNavigationComponent,
        MockActiveFacetsComponent,
        MockFacetListComponent,
        MockCxIconComponent,
      ],
      providers: [
        {
          provide: BreakpointService,
          useClass: MockBreakpointService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaProductFacetNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('mobile', () => {
    it('should not have facet list when trigger button is visible', async(async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const facetList = element.query(By.css('cx-facet-list'));
      expect(facetList).toBeNull();
    }));

    it('should invoke launch when trigger button is clicked', () => {
      spyOn(component, 'launch');
      fixture.detectChanges();
      const button: HTMLElement = element.query(By.css('button')).nativeElement;
      button.click();
      expect(component.launch).toHaveBeenCalled();
    });

    it('should have facet list after trigger button is clicked', async(async () => {
      fixture.detectChanges();
      const button: HTMLElement = element.query(By.css('button')).nativeElement;
      button.click();

      await fixture.whenStable();
      fixture.detectChanges();

      const facetList = element.query(By.css('cx-facet-list')).nativeElement;
      expect(facetList).toBeTruthy();
    }));

    it('should invoke close when closeList is emitted', async(async () => {
      spyOn(component, 'close');
      fixture.detectChanges();
      const button: HTMLElement = element.query(By.css('button')).nativeElement;
      button.click();

      await fixture.whenStable();
      fixture.detectChanges();

      const facetList = element.query(By.css('cx-facet-list')).nativeElement;
      facetList.dispatchEvent(new Event('closeList'));

      expect(component.close).toHaveBeenCalled();
    }));
  });

  describe('desktop', () => {
    it('should have facet list when trigger button is hidden', async(async () => {
      fixture.detectChanges();

      const button: HTMLElement = element.query(By.css('button')).nativeElement;
      button.style.display = 'none';

      await fixture.whenStable();
      fixture.detectChanges();

      const facetList = element.query(By.css('cx-facet-list')).nativeElement;
      expect(facetList).toBeTruthy();
    }));
  });
});
