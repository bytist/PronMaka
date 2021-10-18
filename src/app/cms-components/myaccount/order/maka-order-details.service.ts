import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OccEndpointsService, RoutingService, UserOrderService } from '@spartacus/core';
import { OrderDetailsService } from '@spartacus/storefront';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MakaOrderDetailsService extends OrderDetailsService {
  constructor(
    userOrderService: UserOrderService,
    routingService: RoutingService,
    private occEndpointsService: OccEndpointsService,
    private http: HttpClient,
  ) {
    super(userOrderService, routingService);
  }

  cancelRecurrenceOrder(userId, orderId): Observable<{}> {
    const occEndpointRecurrence = this.occEndpointsService.getUrl('cancelRecurrentOrder', { userId, orderId });
    return this.http.put(occEndpointRecurrence, {});
  }
}
