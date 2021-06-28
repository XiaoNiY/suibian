import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DlogService } from './dlog.service';
import { PccService } from './pcc.service';

@Injectable({
  providedIn: 'root'
})
export class FirmwaresService {

  constructor(
    private http: HttpClient,
    public dlogService: DlogService,
    private pccService: PccService
  ) { }

  getiOSVersions(): Observable<any> {
    const url = this.dlogService.host + 'getFirmwareiosList.xhtml';
    return this.dlogService.get(url);
  }

  getFirmwares(params: HttpParams): Observable<any> {
    let url = this.dlogService.host + 'getFirmwareList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }
}
