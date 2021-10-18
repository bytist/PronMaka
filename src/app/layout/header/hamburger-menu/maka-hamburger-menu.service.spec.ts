// import { TestBed } from '@angular/core/testing';
// import { NavigationStart, Router } from '@angular/router';
// import { of } from 'rxjs';
// import { MakaHamburgerMenuService } from './maka-hamburger-menu.service';
//
// class MockRouter {
//   events = of({ id: 1, url: '' } as NavigationStart);
// }
//
// describe('MakaHamburgerMenuService', () => {
//   let service: MakaHamburgerMenuService;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [{ provide: Router, useClass: MockRouter }],
//     });
//
//     service = TestBed.inject(MakaHamburgerMenuService);
//   });
//
//   it('should inject service', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should toggle the expand state', () => {
//     let expanded: boolean;
//
//     service.toggle();
//     service.isExpanded.subscribe((result) => (expanded = result));
//
//     expect(expanded).toBeTruthy();
//   });
//
//   it('should force expand state to false', () => {
//     let expanded: boolean;
//
//     service.toggle(true);
//     service.isExpanded.subscribe((result) => (expanded = result));
//
//     expect(expanded).toBeFalsy();
//   });
// });
