import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DlogService } from './dlog.service';

@Injectable({
  providedIn: 'root'
})
export class RingsService {

  nav = [
    { title: '酷音铃声', icon: 'kuyin', ptype: 'iframe', partnerName: 'kuyin',
      src: this.sanitizer.bypassSecurityTrustResourceUrl(
        this.dlogService.protocol + '//kyyapp.kuyinxiu.com/friend/16caaeab24cadb55'
      )
    },
    { title: '爱思铃声', icon: 'ring', open: true, children: [
      { title: '精选铃声', ptype: 'rings', remd: 1 },
      { title: '周排行', ptype: 'rings', remd: 21 },
      { title: '月排行', ptype: 'rings', remd: 22 },
      { title: '总排行', ptype: 'rings', remd: 23 },
      { title: '最新', ptype: 'rings', remd: 3 },
      { title: '分类', ptype: 'classify', remd: 4 },
    ] },
    { title: '制作铃声', icon: 'ring-create', ptype: 'makeRing' },
  ];

  ringTypes = [];

  searchTypes = [
    { value: 1, name: '爱思铃声', shortName: '爱思' },
    { value: 2, name: '酷音铃声', shortName: '酷音' }
  ];

  keywordSuggests: string[];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dlogService: DlogService
  ) {
    this.getRingTypes();
  }

  getRingTypes(): void {
    const url = this.dlogService.host + 'getRingTypeList.xhtml';
    const rs: Observable<any> = this.dlogService.get(url);
    rs.subscribe(res => {
      if (res.success) {
        for (let i = 0; i < res.list.length; ++i) {
          // this.ringTypes[res.list[i].id] = res.list[i];
          this.ringTypes.push(res.list[i]);
        }
      }
    });
  }

  getRingType(typeid) {
    for (let i = 0; i < this.ringTypes.length; ++i) {
      if (this.ringTypes[i].id === typeid) {
        return this.ringTypes[i];
      }
    }
    return {
      id: 0,
      name: '其它'
    };
  }

  getRings(params: HttpParams): Observable<any> {
    //
    // return of(APPS);
    // HttpModule
    let url = this.dlogService.host + 'getRingList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  getKeywordSuggests(keyword: string): void {
    let url = this.dlogService.protocol + '//ios3.search.i4.cn/appInfo/jsonRespSuggest.go';
    const params = new HttpParams()
      .set('reqtype', '100')
      .set('ft', '5')
      .set('keyword', keyword);
    url += '?' + params.toString();
    const obs: Observable<any> = this.http.jsonp(url, 'jsoncallback');
    obs.subscribe(res => {
      this.dlogService.add(res, 'rings.getSuggests');
      if (res.length > 0) {
        this.keywordSuggests = res.slice(0, 8);
      }
    });
  }

  search(params: HttpParams): Observable<any> {
    let url = this.dlogService.protocol + '//ring.search.i4.cn/appInfo/jsonpResp.go';
    url += '?' + params.toString();
    return this.http.jsonp(url, 'jsoncallback');
  }
}
