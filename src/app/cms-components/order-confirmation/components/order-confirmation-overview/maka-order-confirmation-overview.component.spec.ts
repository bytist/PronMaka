import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nTestingModule, Order, TranslationService } from '@spartacus/core';
import { Observable, of} from 'rxjs';
import { Card } from '@spartacus/storefront';
import { StoreModule } from '@ngrx/store';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaOrderConfirmationOverviewComponent } from './maka-order-confirmation-overview.component';


@Component({selector: 'app-cx-card', template: ''})
class MockCardComponent {
  @Input()
  content: Card;
}

class MockTranslationService {
  translate(): Observable<string> {
    return of();
  }
}

class MockCheckoutService {
  getOrderDetails(): Observable<Order> {
    return of({});
  }
}

describe('MakaOrderConfirmationOverviewComponent', () => {
  let component: MakaOrderConfirmationOverviewComponent;
  let fixture: ComponentFixture<MakaOrderConfirmationOverviewComponent>;
  let translationService: TranslationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        StoreModule.forRoot({}),
      ],
      declarations: [MakaOrderConfirmationOverviewComponent, MockCardComponent],
      providers: [
        { provide: MakaCheckoutService, useClass: MockCheckoutService },
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakaOrderConfirmationOverviewComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
