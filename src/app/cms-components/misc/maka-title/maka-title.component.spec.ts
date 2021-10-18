import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  DebugElement
} from '@angular/core';
import { CmsComponentData } from '@spartacus/storefront';
import { CmsComponent } from '@spartacus/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

import { MakaTitleComponent } from './maka-title.component';
import {
  CmsMakaTitleComponent,
  CmsMakaImageAlignment
} from 'src/app/core/models/maka-cms.model';

describe('MakaTitleComponent', () => {
  let component: MakaTitleComponent;
  let fixture: ComponentFixture<MakaTitleComponent>;
  let el: DebugElement;

  const componentData: CmsMakaTitleComponent = {
    title: 'Title',
    subtitle: 'Subtitle',
    image: {
      code: '/images/theme/logo_hybris.jpg',
      mime: 'image/svg+xml',
      altText: 'hybris Accelerator',
      url: '/medias/logo-hybris.jpg'
    },
    imageAlignment: CmsMakaImageAlignment.LEFT
  };

  const MockCmsComponentData = {
    data$: of(componentData),
    uid: 'test',
  } as CmsComponentData<CmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakaTitleComponent ],
      providers: [
        {
          provide: CmsComponentData,
          useValue: MockCmsComponentData,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaTitleComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create MakaTitleComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should contain cx-media', () => {
    fixture.detectChanges();
    expect(el.query(By.css('cx-media'))).toBeTruthy();
  });
});
