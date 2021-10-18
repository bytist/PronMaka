import { TestBed } from '@angular/core/testing';
import { MakaPlateService } from './maka-plate.service';
import createSpy = jasmine.createSpy;

describe('MakaPlateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [],
  }));

  it('should be created', () => {
    const service: MakaPlateService = TestBed.get(MakaPlateService);
    expect(service).toBeTruthy();
  });

  it('should return previous final top value', () => {
    const service: MakaPlateService = TestBed.get(MakaPlateService);
    service.finalTopCoordinate = 10;
    service.setFinalTopCoordinate();
    expect(service.finalTopCoordinate).toEqual(10);
  });

  it('should return new final top value', () => {
    const service: MakaPlateService = TestBed.get(MakaPlateService);
    const plate = document.createElement('div');
    plate.className = 'plate';
    document.body.appendChild(plate);
    const flying = document.createElement('div');
    flying.className = 'flying';
    document.body.appendChild(flying);

    service.setFinalTopCoordinate();
    expect(service.finalTopCoordinate).not.toEqual(undefined);
  });

});
