// import {
//   async,
//   ComponentFixture,
//   TestBed
// } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import {
//   Observable,
//   of
// } from 'rxjs';
// import {
//   Cart,
//   OrderEntry,
//   ActiveCartService,
//   SelectiveCartService,
//   AuthService,
//   RoutingService,
//   I18nTestingModule,
//   FeaturesConfigModule
// } from '@spartacus/core';
// import {
//   PromotionService,
//   PromotionsModule
// } from '@spartacus/storefront';

// import { MakaCartDetailsComponent } from './maka-cart-details.component';

// class MockActiveCartService {
//   removeEntry(): void {}
//   loadDetails(): void {}
//   updateEntry(): void {}
//   getActive(): Observable<Cart> {
//     return of<Cart>({ code: '123', totalItems: 1 });
//   }
//   getEntries(): Observable<OrderEntry[]> {
//     return of([{}]);
//   }
//   isStable(): Observable<boolean> {
//     return of(true);
//   }
// }

// class MockPromotionService {
//   getOrderPromotions(): void {}
//   getOrderPromotionsFromCart(): void {}
//   getOrderPromotionsFromCheckout(): void {}
//   getOrderPromotionsFromOrder(): void {}
//   getProductPromotionForEntry(): void {}
// }

// describe('MakaCartDetailsComponent', () => {
//   let component: MakaCartDetailsComponent;
//   let fixture: ComponentFixture<MakaCartDetailsComponent>;
//   let activeCartService: ActiveCartService;

//   const mockSelectiveCartService = jasmine.createSpyObj(
//     'SelectiveCartService',
//     [
//       'getCart',
//       'getLoaded',
//       'removeEntry',
//       'getEntries',
//       'addEntry',
//       'isEnabled',
//     ]
//   );

//   const mockAuthService = jasmine.createSpyObj('AuthService', [
//     'isUserLoggedIn',
//   ]);

//   const mockRoutingService = jasmine.createSpyObj('RoutingService', ['go']);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         RouterTestingModule,
//         PromotionsModule,
//         I18nTestingModule,
//         FeaturesConfigModule,
//       ],
//       declarations: [ MakaCartDetailsComponent ],
//       providers: [
//         {
//           provide: SelectiveCartService,
//           useValue: mockSelectiveCartService
//         },
//         {
//           provide: AuthService,
//           useValue: mockAuthService
//         },
//         {
//           provide: RoutingService,
//           useValue: mockRoutingService
//         },
//         {
//           provide: ActiveCartService,
//           useClass: MockActiveCartService
//         },
//         {
//           provide: PromotionService,
//           useClass: MockPromotionService,
//         }
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MakaCartDetailsComponent);
//     component = fixture.componentInstance;
//     activeCartService = TestBed.inject(ActiveCartService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
