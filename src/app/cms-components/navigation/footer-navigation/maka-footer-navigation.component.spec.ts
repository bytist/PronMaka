import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AnonymousConsentsConfig,
  I18nTestingModule,
} from '@spartacus/core';
import {
  CmsComponentData, NavigationService, NavigationNode, NavigationComponent
} from '@spartacus/storefront';
import { of } from 'rxjs';

import { MakaFooterNavigationComponent } from './maka-footer-navigation.component';
import { CmsMakaFooterNavigationComponent } from '../../../core/models/maka-cms.model';
import createSpy = jasmine.createSpy;


@Component({
  selector: 'app-cx-navigation-ui',
  template: '',
})
class MockNavigationUIComponent {
  @Input() flyout = true;
  @Input() node: NavigationNode;
}

const mockAnonymousConsentsConfig = {
  features: {
    anonymousConsents: false,
  },
};

@Component({
  selector: 'app-cx-generic-link',
  template: '<ng-content></ng-content>',
})
class MockGenericLinkComponent {
  @Input() url: string | any[];
  @Input() target: string;
}

describe('MakaFooterNavigationComponent', () => {
  let component: MakaFooterNavigationComponent;
  let fixture: ComponentFixture<MakaFooterNavigationComponent>;
  let element: DebugElement;

  const mockLinks: NavigationNode[] = [
    {
      title: 'Test child 1',
      url: '/test1',
      target: true,
    },
    {
      title: 'Test child 2',
      url: '/',
      target: false,
    },
  ];

  const mockCmsComponentData = {
    styleClass: 'footer-styling',
    contactInfo: 'contact info',
    notice: 'notice info',
    helpInfo: 'help info',
    customLinks: 'custom links info',
    socialNetworksLinks: 'social networks links info'
  } as CmsMakaFooterNavigationComponent;

  const MockCmsNavigationComponent = {
    data$: of(mockCmsComponentData)
  };

  const mockNavigationService = {
    getNavigationNode: createSpy().and.returnValue(of(null)),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        MakaFooterNavigationComponent,
        NavigationComponent,
        MockNavigationUIComponent,
        MockGenericLinkComponent
      ],
      providers: [
        {
          provide: NavigationService,
          useValue: mockNavigationService,
        },
        {
          provide: CmsComponentData,
          useValue: MockCmsNavigationComponent,
        },
        {
          provide: AnonymousConsentsConfig,
          useValue: mockAnonymousConsentsConfig,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaFooterNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;

    component.node$ = of({
      children: [
        {
          title: 'Test 1',
          url: '/',
          children: mockLinks,
        },
      ],
    });

    fixture.detectChanges();
  });

  it('should create MakaFooterNavigationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should add the component styleClass', () => {
    const navigationUI = element.query(By.css('cx-navigation-ui'));
    expect(navigationUI.nativeElement.classList).toContain('footer-styling');
  });

  it('should test contactInfoHtml', () => {
    const footerContent = element.query(By.css('.footer-content'));
    expect(footerContent.nativeElement.innerHTML).toContain('contact info');
  });

  it('should test helpInfoHtml', () => {
    const footerContent = element.query(By.css('.footer-content'));
    expect(footerContent.nativeElement.innerHTML).toContain('help info');
  });

  it('should test noticeHtml', () => {
    const footerContent = element.query(By.css('.footer-content'));
    expect(footerContent.nativeElement.innerHTML).toContain('notice info');
  });

  it('should test customLinksHtml', () => {
    const footerContent = element.query(By.css('.footer-content'));
    expect(footerContent.nativeElement.innerHTML).toContain('custom links info');
  });

  it('should test socialNetworksLinksHtml', () => {
    const footerContent = element.query(By.css('.footer-content'));
    expect(footerContent.nativeElement.innerHTML).toContain('social networks links info');
  });
});
