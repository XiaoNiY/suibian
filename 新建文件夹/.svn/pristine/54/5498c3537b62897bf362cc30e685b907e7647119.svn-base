import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WaperTableComponent } from './waper-table/waper-table.component';
import { DlogService } from './dlog.service';

@Injectable({
  providedIn: 'root'
})
export class WapersService {

  // 模块 数据
  waperModels = [
    // scale = height / width
    { value: 'iPhone12,5', name: 'iPhone 11 Pro Max', scale: 2.164 },
    { value: 'iPhone12,3', name: 'iPhone 11 Pro', scale: 2.165 },
    { value: 'iPhone12,1', name: 'iPhone 11', scale: 2.164 },
    { value: 'iPhone11,4', name: 'iPhone XS Max', scale: 2.165 },
    { value: 'iPhone11,2', name: 'iPhone XS', scale: 2.165 },
    { value: 'iPhone11,8', name: 'iPhone XR', scale: 2.165 },
    { value: 'iPhone10,3', name: 'iPhone X', scale: 2.165 },
    { value: 'iPhone10,2', name: 'iPhone 8 Plus', scale: 1.778 },
    { value: 'iPhone10,1', name: 'iPhone 8', scale: 1.778 },
    { value: 'iPhone9,2', name: 'iPhone 7 Plus', scale: 1.778 },
    { value: 'iPhone9,1', name: 'iPhone 7', scale: 1.778 },
    { value: 'iPhone8,2', name: 'iPhone 6s Plus', scale: 1.778 },
    { value: 'iPhone8,1', name: 'iPhone 6s', scale: 1.778 },
    { value: 'iPhone7,1', name: 'iPhone 6 Plus', scale: 1.778 },
    { value: 'iPhone7,2', name: 'iPhone 6', scale: 1.778 },
    { value: 'iPhone6,1', name: 'iPhone 5s', scale: 1.775 },
    { value: 'iPhone5,3', name: 'iPhone 5c', scale: 1.775 },
    { value: 'iPhone5,1', name: 'iPhone 5', scale: 1.775 },
    { value: 'iPhone4,1', name: 'iPhone 4s', scale: 1.5 },
    { value: 'iPhone3,1', name: 'iPhone 4', scale: 1.5 },
    { value: 'iPad6,7', name: 'iPad Pro', scale: 1 },
    { value: 'iPad5,3', name: 'iPad Air 2', scale: 1 },
    { value: 'iPad4,1', name: 'iPad Air', scale: 1 },
    { value: 'iPad5,1', name: 'iPad mini 4', scale: 1 },
    { value: 'iPad4,7', name: 'iPad mini 3', scale: 1 },
    { value: 'iPad4,4', name: 'iPad mini 2', scale: 1 },
    { value: 'iPad2,5', name: 'iPad mini', scale: 1 },
    { value: 'iPad3,4', name: 'iPad 4', scale: 1 },
    { value: 'iPad3,1', name: 'iPad 3', scale: 1 },
    { value: 'iPad2,1', name: 'iPad 2', scale: 1 },
    { value: 'iPad1,1', name: 'iPad', scale: 1 },
  ];

  // 导航 数据
  nav: any[] = [
    { title: '精选', icon: 'jingxuan', ptype: 'wapers', remd: 1, typeid: 0 },
    { title: '最新', icon: 'news', ptype: 'wapers', remd: 3, typeid: 0 },
    { title: '排行榜', icon: 'ranking', ptype: 'wapers', remd: 21, typeid: 0 },
  ];

  // 壁纸查看器 数据
  viewer = {
    waperTable: null,
    waper: null
  };

  keywordSuggests: string[];

  constructor(
    private http: HttpClient,
    private dlogService: DlogService
  ) {
    this.loadWaperTypes();
  }

  loadWaperTypes(): void {
    const url = this.dlogService.host + 'getWallpaperTypeList.xhtml';
    const rs: Observable<any> = this.dlogService.get(url);
    rs.subscribe(res => {
      if (res.success) {
        // 增加导航
        const navClassify = { title: '分类', icon: 'classify', open: true, children: [] };
        for (let i = 0; i < res.list.length; ++i) {
          navClassify.children.push({
            title: res.list[i].name,
            ptype: 'wapers',
            typeid: res.list[i].id,
            remd: 4,
          });
        }
        this.nav.push(navClassify);
      }
    });
  }

  getWapers(params: HttpParams): Observable<any> {
    //
    // return of(APPS);
    // HttpModule
    let url = this.dlogService.host + 'getWallpaperList.xhtml';
    url += '?' + params.toString();
    return this.dlogService.get(url);
  }

  // 关键字提示
  getKeywordSuggests(keyword: string): void {
    let url = 'https://search-paper-m.i4.cn/getPaperInputSuggest.xhtml';
    const params = new HttpParams()
      .set('fti', '4')
      .set('keyword', keyword);
    url += '?' + params.toString();
    const obs: Observable<any> = this.http.jsonp(url, 'jsonp');
    obs.subscribe(res => {
      this.dlogService.add(res, 'wapers.getSuggests');
      if (res.count > 0) {
        this.keywordSuggests = res.list.slice(0, 8);
      }
    });
  }

  // 搜索
  search(params: HttpParams): Observable<any> {
    let url = 'https://search-paper-m.i4.cn/getPaperList.xhtml';
    url += '?' + params.toString();
    return this.http.jsonp(url, 'jsonp');
  }

  setViewer(waperTable: WaperTableComponent, waper: any) {
    this.viewer.waperTable = waperTable;
    this.setViewerWaper(waper);
  }

  // 设置 壁纸查看器 查看的壁纸
  setViewerWaper(waper): void {
    this.viewer.waper = waper;
    if (waper) {
      this.viewer.waperTable.loadIargeImage(waper);
      // 加载相邻的大图
      this.viewer.waperTable.loadIargeImage(waper.prev);
      this.viewer.waperTable.loadIargeImage(waper.next);
    }
  }

  getWperModelForModel(model): any {
    for (let i = 0; i < this.waperModels.length; ++i) {
      if (this.waperModels[i].value === model) {
        return this.waperModels[i];
      }
    }
    return null;
  }

}
