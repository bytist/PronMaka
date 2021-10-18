import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  DebugElement
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { MakaSectionTitleComponent } from './maka-section-title.component';

describe('MakaSectionTitleComponent', () => {
  let component: MakaSectionTitleComponent;
  let fixture: ComponentFixture<MakaSectionTitleComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakaSectionTitleComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaSectionTitleComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create MakaSectionTitleComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should contain title', () => {
    fixture.detectChanges();
    expect(el.query(By.css('h5'))).toBeTruthy();
  });
});
