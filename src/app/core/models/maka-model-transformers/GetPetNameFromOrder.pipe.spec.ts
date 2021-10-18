import { TestBed } from '@angular/core/testing';

import { GetPetNameFromOrderPipe } from './GetPetNameFromOrder.pipe';

const mockOrderHistory = {
    petName: 'Laika'
};

describe('GetNameFromOrderPipe', () => {
  let pipe: GetPetNameFromOrderPipe;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        GetPetNameFromOrderPipe
      ],
    });

    pipe = TestBed.inject(GetPetNameFromOrderPipe);
  });

  describe('transform', () => {
    it('should extract petName value', () => {
      expect(pipe.transform(mockOrderHistory)).toBe('Laika');
    });
  });
});
