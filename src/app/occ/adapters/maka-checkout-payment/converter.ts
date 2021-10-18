import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';

import { MakaPaymentDetails } from 'src/app/core/models/maka-cart.model';

export const MAKA_PAYMENT_DETAILS_SERIALIZER = new InjectionToken<
  Converter<MakaPaymentDetails, any>
>('PaymentDetailsSerializer');

export const MAKA_PAYMENT_DETAILS_NORMALIZER = new InjectionToken<
  Converter<any, MakaPaymentDetails>
>('PaymentDetailsNormalizer');
