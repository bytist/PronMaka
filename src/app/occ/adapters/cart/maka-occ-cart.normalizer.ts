import {
    Occ,
    Converter
} from '@spartacus/core';
import { Injectable } from '@angular/core';

import { MakaCart } from 'src/app/core/models/maka-cart.model';

@Injectable()
export class MakaOccCartNormalizer implements Converter<Occ.Cart, MakaCart> {
    convert(source: any, target?: MakaCart): MakaCart {

        if (target === undefined){
            target = { ...(source) };
        }

        if (source.recurrence) {
            target.recurrence = source.recurrence;
        }

        if (source.recurrenceConfigurations){
            target.recurrenceConfigurations = source.recurrenceConfigurations;
        }

        return target;
    }
}