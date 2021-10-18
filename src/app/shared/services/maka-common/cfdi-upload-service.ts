import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MakaCfdiUploadService {
  constructor(private http: HttpClient, private occEndpointsService: OccEndpointsService) {}

  public uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const occEndpointPayment = this.occEndpointsService.getUrl('uploadCfdi', {userId: 'current'});
    const req = new HttpRequest('POST', occEndpointPayment, formData, {reportProgress: true, responseType: 'json'});
    return this.http.request(req);
  }
}
