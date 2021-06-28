import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';

import { AppsService } from '../apps.service';
import { Observable, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit, OnChanges {
  /**
   * 适用设备
   * iPhone || iPad
   */
  @Input() model = 'iPhone';
  /**
   * ?
   */
  @Input() pkagetype = 1;
  /**
   * 个人签
   */
  @Input() ts = 1;
  /**
   * ?
   */
  @Input() from = 1;
  /**
   * APP ID
   */
  @Input() id: any;

  /**
   * 刷新标志 此标志发生改变时，重新获取数据
   */
  @Input() refreshFlag = 0;

  // 数据
  info = null;

  // 历史版本数据
  historyArray = [];

  // 错误
  error: any = null;
  // 状态
  status = 'none';

  constructor(
    public pccService: PccService,
    public appsService: AppsService,
    private dlogService: DlogService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
  }

  reset() {
    this.updateStatus('none');
    this.info = null;
    this.getAppInfo();
  }

  updateStatus(status, data?: any): void {
    this.status = status;
    this.error = null;
    switch (this.status) {
      // 没有更多数据
      case 'nomore':
        if (!this.info) {
          this.error = {
            message: '无应用信息',
            icon: './assets/no-apps.png',
            retry: false
          };
        }
        break;
      // 发生错误
      case 'error':
        if (!this.info) {
          this.error = {
            message: '数据请求失败',
            icon: './assets/error.png',
            retry: true
          };
        }
        break;
    }
    this.dlogService.add([this.status, data], 'updateStatus');
  }

  getAppInfo() {
    if (this.status !== 'none') {
      return;
    }
    this.updateStatus('loading');
    this.appsService.getAppInfo(
      new HttpParams()
        .set('appid', this.id)
        .set('pkagetype', this.pkagetype + '')
        .set('model', this.model)
        .set('from', this.from + '')
        .set('ts', this.ts + '')
    ).subscribe(res => {
      this.info = this.appsService.formatApp(res);
      this.info.downId = this.info.sourceid + "_" + this.info.Version;

      let dev = 'iPhone、iPod touch';
      if (this.info.Platform === 103) {
        dev = 'iPhone、iPad、iPod touch';
      } else if (this.info.Platform === 102) {
        dev = 'iPad';
      }
      this.info.System = `需要iOS ${this.info.MinVersion}或更高版本。与${dev}兼容`;

      this.info.iPhoneImages = [];
      this.info.iPadImages = [];
      for (let i = 0; i < this.info.Image.length; ++i) {
        if (this.info.Image[i].indexOf('iphone') > -1) {
          this.info.iPhoneImages.push(this.info.Image[i]);
        } else if (this.info.Image[i].indexOf('ipad') > -1) {
          this.info.iPadImages.push(this.info.Image[i]);
        }
      }

      this.info.NewVersionNote = this.info.NewVersionNote.replace(/\n/g, '<br>');
      this.info.LongNote = this.info.LongNote.replace(/\n/g, '<br>');


      this.updateStatus('nomore');
      // 发送消息 获取本地、设备资源列表 到客户端
      this.pccService.sendClientMessage({
        code: 10,
        tag: 1,
      });
      this.pccService.appid = this.info.AppId;
      this.historyArray = [];

      for (let index = 0; index < this.info.historyversion.length; index++) {
        const obj: any = {
          "id": this.info.AppId,
          "AppId": this.info.AppId,
          "AppName": this.info.AppName,
          "Icon": this.info.Icon,
          "DownloadCount": this.info.DownloadCount,
          "Size": this.info.Size,
          "sizebyte": this.info.sizebyte,
          "Version": this.info.historyversion[index].Version,
          "ShortVersion": this.info.historyversion[index].Version,
          "LongVersion": this.info.historyversion[index].Version,
          "MinVersion": this.info.MinVersion,
          "Sort": this.info.Sort,
          "Type": this.info.Type,
          "TypeName": this.info.TypeName,
          "Company": this.info.Company,
          "Language": this.info.Language,
          "Platform": this.info.Platform,
          "UpdateTime": this.info.UpdateTime,
          "pkagetype": this.info.pkagetype,
          "path": this.info.path,
          "sourceid": this.info.sourceid,
          "buyuseid": this.info.buyuseid,
          "plist": this.info.plist,
          "localplist": this.info.localplist,
          "havePackage": "1",
          "shortshortnote": this.info.shortshortnote,
          "md5": this.info.md5,
          "itemid": this.info.itemid,
          "versionid": this.info.versionid,
          "dlchannel": this.info.dlchannel,
          "certname": this.info.certname,
          "success": this.info.success
        };
        obj.itunesid = this.info.sourceid;
        obj.Size = this.info.historyversion[index].Size;
        obj.Version = this.info.historyversion[index].Version;
        obj.version = this.info.historyversion[index].Version;
        obj.md5 = this.info.historyversion[index].md5;
        obj.path = this.info.historyversion[index].path;
        obj.releasetime = this.info.historyversion[index].releasetime;
        obj.sizebyte = this.info.historyversion[index].sizebyte;
        obj.versionid = this.info.historyversion[index].versionid;
        obj.versionnote = this.info.historyversion[index].versionnote;
        obj.downId = this.info.sourceid + "_" + this.info.historyversion[index].Version;
        
        this.historyArray.push(this.appsService.formatApp(obj));
      }
    }, error => {
      this.updateStatus('error', error);
    });
  }
}
