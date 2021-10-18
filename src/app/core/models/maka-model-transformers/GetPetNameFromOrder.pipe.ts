import {
    PipeTransform,
    Pipe
} from '@angular/core';

import { MakaOrderHistory } from '../maka-order.model';

@Pipe({
    name: 'getPetName',
    pure: true
  })
export class GetPetNameFromOrderPipe implements PipeTransform {

    transform(value: any): string | null {
        return this.getPetName(value);
    }

    getPetName(orderHistory: MakaOrderHistory) {
        return orderHistory.petName;
    }
}
