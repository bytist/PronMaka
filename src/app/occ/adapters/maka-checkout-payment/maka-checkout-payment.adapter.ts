import { Injectable } from '@angular/core';
import {
    OccCheckoutPaymentAdapter,
    OccEndpointsService,
    ConverterService,
    PaymentDetails
} from '@spartacus/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MAKA_PAYMENT_DETAILS_SERIALIZER, MAKA_PAYMENT_DETAILS_NORMALIZER } from './converter';
import { MakaPaymentDetails } from 'src/app/core/models/maka-cart.model';

@Injectable()
export class MakaCheckoutPaymentAdapter extends OccCheckoutPaymentAdapter {

    constructor(
        http: HttpClient,
        occEndpoints: OccEndpointsService,
        converter: ConverterService
    ) {
        super(
            http,
            occEndpoints,
            converter
        );
    }

    public create(
        userId: string,
        cartId: string,
        paymentDetails: PaymentDetails
    ): Observable<PaymentDetails> {
        paymentDetails = this.converter.convert(
            paymentDetails,
            MAKA_PAYMENT_DETAILS_SERIALIZER
        );
        return this.http.post<MakaPaymentDetails>(
            this.getCartEndpoint(userId) + cartId + '/openpay/addPaymentDetails',
            paymentDetails).pipe(this.converter.pipeable(MAKA_PAYMENT_DETAILS_NORMALIZER));
    }
}
