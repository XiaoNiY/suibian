import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DlogService {

  debug = false;

  host: string;
  protocol = 'http:';

  version = '20190319';

  logs = [];

  constructor(
    public http: HttpClient
  ) {
    // 兼容 http htpps协议
    this.protocol = window.location.protocol || 'http:';
    // this.host = this.protocol + (this.debug ? '//120.27.160.46:81/' : '//app4.i4.cn/');
    this.host = this.protocol + (this.debug ? '//app4.i4.cn/' : '//app4.i4.cn/');
    this.add(this.version, 'VERSION');
    this.add(this.protocol, 'PROTOCOL');
    this.add(this.host, 'HOST');
  }

  get(url: string, options?: any): Observable<any> {
    if (this.debug) {
      return this.http.jsonp(url, options || 'callback');
    } else {
      return this.http.get(url, options);
    }
  }

  add(log: any, name?: string): void {
    try {
      if (typeof log === 'object') {
        log = JSON.stringify(log);
      }
    } catch (e) {
      log = '无法转日志对象为字符串::' + e;
    }
    const logItem = {
      time: Date.now(),
      name: name || 'none',
      log: log,
    };
    this.logs.unshift(logItem);

    if (this.logs.length > 1000) {
      this.logs = this.logs.splice(0, 100);
    }

    if (this.debug) {
      window.console.log(JSON.stringify(logItem));
    }
  }

  clear() {
    this.logs = [];
  }
}
