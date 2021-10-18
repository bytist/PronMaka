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

import { MakaVideoComponent } from './maka-video.component';
import { CmsMakaVideoComponent } from '../../../core/models/maka-cms.model';

describe('MakaVideoComponent', () => {
  let component: MakaVideoComponent;
  let fixture: ComponentFixture<MakaVideoComponent>;
  let el: DebugElement;

  const componentData: CmsMakaVideoComponent = {
    url: 'https://www.youtube.com/embed/H3k7PCCuut8',
  };

  const MockCmsComponentData = {
    data$: of(componentData),
    uid: 'test',
  } as CmsComponentData<CmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakaVideoComponent ],
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
    fixture = TestBed.createComponent(MakaVideoComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create MakaVideoComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should return trusted url', () => {
    fixture.detectChanges();
    expect(component.trustUrl(componentData.url)).toBeTruthy();
  });

  it('should return true for a vimeo video, false in other case', () => {
    fixture.detectChanges();
    expect(component.isVimeo('https://player.vimeo.com/video/56282283')).toBe(true);
    expect(component.isVimeo('https://www.youtube.com/embed/vimeo/H3k7PCCuut8')).toBe(false);
    expect(component.isVimeo('')).toBe(false);
  });
});
