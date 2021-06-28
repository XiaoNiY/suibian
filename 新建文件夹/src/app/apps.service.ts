import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DlogService } from './dlog.service';
import { PccService } from './pcc.service';

@Injectable({
  providedIn: 'root'
})
export class AppsService {
  header = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  model = 'iPhone';
  appTypes = [
    null,
    [ { value: 0, name: '全部' } ],
    [ { value: 0, name: '全部' } ]
  ];

  // 爱思应用类型与iTunes应用类型对应关系
  itunesAppTypes = {
    // i4typeid   itunesTypeid
    103: 6005,
    104: 6010,
    105: 6012,
    106: 6016,
    107: 6002,
    108: 6011,
    109: 6008,
    110: 6007,
    111: 6018,
    112: 6001,
    113: 6009,
    114: 6015,
    115: 6023,
    116: 6003,
    117: 6006,
    118: 6000,
    119: 6017,
    120: 6013,
    121: 6020,
    122: 6022,
    123: 6004,
  };

  // 应用路径 用于搜索到的APP
  appPaths = {
    1: 'http://d.app6.i4.cn/soft/',
    2: 'http://d.app7.i4.cn/soft/',
    3: 'http://d.app8.i4.cn/soft/'
  };

  reportApp = null;
  clarenceApp = null;

  keywordSuggests: string[];

  constructor(
    private http: HttpClient,
    public dlogService: DlogService,
    private pccService: PccService
  ) {
    this.getAppTypes();
  }

  formatApp(app) {
    if (app.downloadCount) {
      // 搜索到的App
      app.icon = 'https://d-image.i4.cn/image/' + app.icon;
      app.path = (this.appPaths[app.serverNum] || '') + app.path;
      app.appname = app.appName;
      app.name = app.appName;
      app.sizebyte = app.sizeByte;
      app.isfull = app.isFull;
      app.downloaded = this.converNum(app.downloadCount);
      app.shortversion = app.shortVersion;
      app.longversion = app.longVersion;
      app.minversion = app.minVersion;
      app.bundleid = app.sourceId;
      app.itunesid = app.itemId;
      app.checkcode = app.fileCheckCode;
      app.md5 = app.fileCheckCode;
      app.slogan = app.shortShortNote;
      app.versionid = app.versionId;

    } else if (app.AppId) {
      // App详情
      app.id = app.AppId;
      app.icon = app.Icon;
      app.name = app.AppName;
      app.shortversion = app.ShortVersion;
      app.longversion = app.LongVersion;
      app.minversion = app.MinVersion;
      app.bundleid = app.sourceid;
      app.sort = app.Sort;
      app.type = app.Type;
      app.itunesid = app.itemid;
      
    } else {
      // App 列表
      app.name = app.appname;
      app.bundleid = app.sourceid;
      app.itunesid = app.itemid;
      app.checkcode = app.md5;
      
    }
    app.downId = app.bundleid + "_" + app.version;

    app.typeid = app.sort === 1 ? this.itunesAppTypes[app.type] || 0 : 6014;
    this.dlogService.add(app, 'appinfo');
    return app;
  }

  converNum(number) {
    let num = number;
    if (num < 0) {
      return 0;
    }
    if (!isNaN(number)) {
      if (number >= 100000000) {
        num = Math.round((number / 100000000) * 100) / 100 + '亿';
      } else if (number >= 1000000) {
        num = Math.round(number / 10000) + '万';
      } else if (number >= 10000) {
        num = Math.round((number / 10000) * 10) / 10 + '万';
      }
    }
    return num;
  }

  getApps(params: HttpParams): Observable<any> {
    let url = this.dlogService.host + 'getAppList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  getBanners(params: HttpParams): Observable<any> {
    let url = this.dlogService.host + 'getAdInfoList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  getAppInfo(params: HttpParams): Observable<any> {
    // return APPINFO;
    let url = this.dlogService.host + 'appinfo.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  getSpecials(params: HttpParams): Observable<any> {
    let url = this.dlogService.host + 'getSpecialList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  getAppTypes(): void {
    const url = this.dlogService.host + 'getAppTypeList.xhtml';
    const rs: Observable<any> = this.dlogService.get(url);
    rs.subscribe(res => {
      if (res.success) {
        for (let i = 0; i < res.sort_1.length; ++i) {
          res.sort_1[i].value = res.sort_1[i].id;
          this.appTypes[1].push(res.sort_1[i]);
        }
        for (let i = 0; i < res.sort_2.length; ++i) {
          res.sort_2[i].value = res.sort_2[i].id;
          this.appTypes[2].push(res.sort_2[i]);
        }
      }
    });
  }

  getKeywordSuggests(keyword: string): void {
    let url = this.dlogService.protocol + '//ios3-search.i4.cn/appInfo/jsonRespSuggest.go';
    const params = new HttpParams()
      .set('reqtype', '100')
      .set('ft', this.pccService.getJail() === 1 ? '1' : '3')
      .set('keyword', keyword);
    url += '?' + params.toString();
    const obs: Observable<any> = this.http.jsonp(url, 'jsoncallback');
    obs.subscribe(res => {
      this.dlogService.add(res, 'apps.getSuggests');
      if (res.length > 0) {
        this.keywordSuggests = res.slice(0, 8);
      }
    });
  }

  search(params: HttpParams): Observable<any> {
    let url = this.dlogService.protocol + '//ios3-search.i4.cn/appInfo/jsonpResp.go';
    url += '?' + params.toString();
    return this.http.jsonp(url, 'jsoncallback');
  }

  setReportApp(app: any): void {
    this.reportApp = app;
  }
  setClarenceApp(app: any): void {
    this.clarenceApp = app;
  }

  report(params: HttpParams): Observable<any> {
    const url = this.dlogService.host + 'putinform.xhtml';
    return this.http.post(url, params, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });
  }
  clarence(params: HttpParams): Observable<any> {
    let url = this.dlogService.host + 'appversionapply.xhtml';

    if (this.dlogService.debug) {
        url = this.dlogService.host + 'app/info/appHistoryVersionApply.go';
    }
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }
}
