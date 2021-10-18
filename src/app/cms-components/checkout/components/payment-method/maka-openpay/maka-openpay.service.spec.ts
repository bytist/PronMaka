import { async, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  I18nTestingModule,
} from '@spartacus/core';
import createSpy = jasmine.createSpy;

import { MakaOpenpayService } from './maka-openpay.service';
import { MakaScriptTagService } from '../../../../../shared/services/maka-script-tag.service';

class MockScriptTagService {
  addScript(){}

  removeScript(){}
}

class MockRenderer2 {
  removeChild() {}
}

describe('MakaOpenpayService', () => {
  let scriptTagService: MakaScriptTagService;
  let service: MakaOpenpayService;
  let renderer2: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
      ],
      providers: [
        { provide: MakaScriptTagService, useClass: MockScriptTagService },
        { provide: Renderer2, useClass: MockRenderer2 },
      ],
    }).compileComponents();

    service = TestBed.inject(MakaOpenpayService);
    scriptTagService = TestBed.inject(MakaScriptTagService);
    renderer2 = TestBed.inject(Renderer2);
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add scripts', () => {
    spyOn(scriptTagService, 'addScript').and.stub();
    service.addScripts(null, () => {});
    expect(scriptTagService.addScript).toHaveBeenCalled();
  });

  it('should remove scripts', () => {
    spyOn(scriptTagService, 'removeScript').and.stub();
    service.setInserted(true);
    service.removeScripts(renderer2);
    expect(scriptTagService.removeScript).toHaveBeenCalled();
  });

  it('should set inserted', () => {
    service.setInserted(true);
    expect(service.getInserted()).toBe(true);
  });

});
