import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    ConverterService,
    OccEndpointsService,
    OrderHistoryList,
    ORDER_HISTORY_NORMALIZER
} from '@spartacus/core';
import { Observable } from 'rxjs';

import { MakaOrderHistorySearch } from '../../../core/models/maka-order.model';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class MakaUserOrderService {

    constructor(
        private occEndpointsService: OccEndpointsService,
        private http: HttpClient,
        private converter: ConverterService
    ){}

    fetchOrderHistory(
        userId: string,
        event: MakaOrderHistorySearch
    ): Observable<OrderHistoryList> {
        const params = {};
        params['pageSize'] = environment.defaultPageSize;
        params['currentPage'] = event.currentPage.toString(10);
        params['sort'] = event.sortCode.toString();
        params['recurrentOrders'] = `${event.recurrentOrders}`;

        const url = this.occEndpointsService.getUrl('orderHistory', { userId }, params);

        return this.http.get<OrderHistoryList>(url).pipe(this.converter.pipeable(ORDER_HISTORY_NORMALIZER));
    }
}
