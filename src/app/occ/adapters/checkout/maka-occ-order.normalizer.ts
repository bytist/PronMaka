import { Injectable } from '@angular/core';
import {
    Converter,
    Occ,
    ConverterService,
    OrderEntry,
    PRODUCT_NORMALIZER
} from '@spartacus/core';

import { MakaOrder } from 'src/app/core/models';

@Injectable({ providedIn: 'root' })
export class MakaOccOrderNormalizer implements Converter<Occ.Order, MakaOrder> {
  constructor(private converter: ConverterService) {}

  convert(source: any, target?: MakaOrder): MakaOrder {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    if (source.openPay3DSTransactionId) {
        target.openPay3DSTransactionId = source.openPay3DSTransactionId;
    }

    if (source.openPay3DSTransactionUrl) {
        target.openPay3DSTransactionUrl = source.openPay3DSTransactionUrl;
    }

    return target;
  }
}
