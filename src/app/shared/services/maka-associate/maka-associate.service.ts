import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  OccEndpointsService,
  AuthService,
  InterceptorUtil,
  USE_CLIENT_TOKEN
} from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  take,
  map,
  switchMap
} from 'rxjs/operators';

import { MakaPartner } from 'src/app/core/models/maka-user.model';
import { CustomerInvitation } from '../../../core/models/maka-customer-invitation.model';
import { AssociateCommissionRecord } from '../../../core/models/maka-associate-commission-record.model';
import { AssociateCommissionRecordHistoryPage } from '../../../core/models/maka-associate-commission-record-history.model';
import { AssociateDashboardCommission } from '../../../core/models/maka-associate-dashboard-commission.model';
import { AssociateDashboardCommissionOrders } from '../../../core/models/maka-associate-dashboard-commission-orders.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MakaAssociateService {

  constructor(
    private http: HttpClient,
    private occEndpointsService: OccEndpointsService,
    private authService: AuthService
  ) {}

  getCurrentAssociate(): Observable<MakaPartner> {
    return this.getAssociateEndpointUrl().pipe(
      switchMap(([url]) => {
        return this.http.get<MakaPartner>(url);
      })
    );
  }

  getAssociateEndpointUrl(): Observable<[string]> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      map(([userId]) => {
        return [
          `${baseUrl}/associates/${userId}?fields=FULL`
        ];
      })
    );
  }

  /**
   * Send an invitation email to customer
   */
  sendCustomerInvitation(customerInvitation: CustomerInvitation): Observable<any> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        return this.http.post<any>(`${baseUrl}/associates/${userId}/invitation`, customerInvitation, {});
      })
    );
  }

  /**
   * Get last payable commission record for associate
   */
  getLastPayableCommissionRecordForCurrentAssociate(): Observable<AssociateCommissionRecord> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        return this.http.get<AssociateCommissionRecord>(`${baseUrl}/associates/${userId}/commissions/current`);
      })
    );
  }

  /**
   * Get paged associate commission records for a given year
   */
  getAssociateCommissionRecordsHistory(year: string, currentPage: number): Observable<AssociateCommissionRecordHistoryPage> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        const params = {};
        params['pageSize'] = environment.defaultPageSize;
        params['currentPage'] = currentPage;
        params['year'] = year;

        return this.http.get<AssociateCommissionRecordHistoryPage>(`${baseUrl}/associates/${userId}/commissions`, {params});
      })
    );
  }

  /**
   * Get associate's commission record for given code
   */
  getAssociatesCommissionRecord(code: string): Observable<AssociateCommissionRecord> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        return this.http.get<AssociateCommissionRecord>(`${baseUrl}/associates/${userId}/commissions/${code}`);
      })
    );
  }

  /**
   * Get associate's commission record linked orders for given code
   */
  getAssociatesCommissionRecordOrders(code: string, currentPage: number): Observable<AssociateDashboardCommissionOrders> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        const params = {};
        params['pageSize'] = environment.defaultPageSize;
        params['currentPage'] = currentPage;

        return this.http.get<AssociateDashboardCommissionOrders>(`${baseUrl}/associates/${userId}/commissions/${code}/orders`, {params});
      })
    );
  }

  register(partner: MakaPartner): Observable<any> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http.post<any>(`${baseUrl}/associates`, partner, { headers });
  }

  search(associateId: string): Observable<MakaPartner> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    let headers = new HttpHeaders();
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http.get<MakaPartner>(`${baseUrl}/associates/search?code=${associateId}`, { headers });
  }

  forecastAssociateCommission(): Observable<AssociateDashboardCommission> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        return this.http.get<any>(`${baseUrl}/associates/${userId}/dashboard/commission/info`, {});
      })
    );
  }

  searchDashboardAssociateReferralOrders(currentPage: number): Observable<AssociateDashboardCommissionOrders> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        const params = {};
        params['pageSize'] = environment.defaultPageSize;
        params['currentPage'] = currentPage;

        return this.http.get<AssociateDashboardCommissionOrders>(`${baseUrl}/associates/${userId}/dashboard/commission/orders`, {params});
      })
    );
  }

  getDashboardStats(): Observable<any> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.authService.getOccUserId().pipe(
      take(1),
      switchMap(([userId]) => {
        return this.http.get<any>(`${baseUrl}/associates/${userId}/statistics`, {});
      })
    );
  }
}
