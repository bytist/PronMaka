import { Occ, Converter } from '@spartacus/core';
import { Injectable } from '@angular/core';

import { MakaOrderHistory } from 'src/app/core/models/maka-order.model';

@Injectable()
export class MakaOccUserOrderHistoryNormalizer implements Converter<Occ.OrderHistory, MakaOrderHistory>
{
    convert(source: any, target?: MakaOrderHistory): MakaOrderHistory {

        if (target === undefined) {
            target = { ...(source) };
        }

        if (source.petName)
        {
            target.petName = source.petName;
        }

        return target;
    }
}
