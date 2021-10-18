import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  DebugElement
} from '@angular/core';
import { CmsComponentData } from '@spartacus/storefront';
import {CmsComponent, OccConfig} from '@spartacus/core';
import { of } from 'rxjs';

import { MakaBannerComponent } from './maka-banner.component';
import {
  CmsMakaBanner,
  CMSMakaBannerAlignment,
} from 'src/app/core/models/maka-cms.model';

describe('MakaBannerComponent', () => {
  let component: MakaBannerComponent;
  let fixture: ComponentFixture<MakaBannerComponent>;
  let el: DebugElement;

  const componentData: CmsMakaBanner = {
    contentAlignment: CMSMakaBannerAlignment.TOP,
    backgroundImage: {
      altText: 'banner image',
      url: '/medias/banner-image.jpg',
      code: '/images/theme/banner-image.jpg',
      mime: 'image/svg+xml',
    },
    backgroundColor: '#fff',
    content: '<div class="banner-sample-content">',
  };

  const mockOccModuleConfig: OccConfig = {
    backend: {
      occ: {
        baseUrl: '',
        prefix: '',
      },
    },
  };

  const MockCmsComponentData = {
    data$: of(componentData),
    uid: 'test',
  } as CmsComponentData<CmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakaBannerComponent ],
      providers: [
        { provide: CmsComponentData, useValue: MockCmsComponentData },
        { provide: OccConfig, useValue: mockOccModuleConfig }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaBannerComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create MakaBannerComponent', () => {
    expect(component).toBeTruthy();
  });
});
