import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { MakaHeaderAnimationService } from './cms-components/navigation/header-animation/maka-header-animation.service';


class MockMakaHeaderAnimationService {
  myAccountMenuOpened$ = new BehaviorSubject(false);
  init() {}
}

describe('AppComponent', () => {
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: MakaHeaderAnimationService, useClass: MockMakaHeaderAnimationService },
      ],
      imports: [RouterTestingModule]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'maka-storefront'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('maka-storefront');
  });

});
