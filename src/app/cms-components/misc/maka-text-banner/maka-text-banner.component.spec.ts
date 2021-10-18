import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MakaTextBannerComponent } from './maka-text-banner.component';

describe('MakaTextBannerComponent', () => {
  let component: MakaTextBannerComponent;
  let fixture: ComponentFixture<MakaTextBannerComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [MakaTextBannerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaTextBannerComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    component.title = 'Title';
    component.subtitle = 'Subtitle';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain title', () => {
    fixture.detectChanges();
    expect(el.query(By.css('h1'))).toBeTruthy();
  });

  it('should contain subtitle', () => {
    fixture.detectChanges();
    expect(el.query(By.css('h2'))).toBeTruthy();
  });

  it('should not contain img', () => {
    fixture.detectChanges();
    expect(el.query(By.css('img'))).toBeFalsy();
  });
});
