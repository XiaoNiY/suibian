import { Component, OnInit, DoCheck } from '@angular/core';

import { WapersService } from '../wapers.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-waper-viewer',
  templateUrl: './waper-viewer.component.html',
  styleUrls: ['./waper-viewer.component.css']
})
export class WaperViewerComponent implements OnInit, DoCheck {

  waperWidth = 0;

  constructor(
    public pccService: PccService,
    public wapersService: WapersService,
    public dlogService: DlogService
  ) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.wapersService.viewer.waper) {
      this.waperWidth = document.getElementById('layout').offsetHeight * 0.75 / this.wapersService.viewer.waperTable.model.scale;
      this.wapersService.viewer.waperTable.loadIargeImage(this.wapersService.viewer.waper);
    }
  }

  prev(): void {
    if (this.wapersService.viewer.waper.prev) {
      this.wapersService.setViewerWaper(this.wapersService.viewer.waper.prev);
    }
  }

  next(): void {
    if (this.wapersService.viewer.waper.next) {
      this.wapersService.setViewerWaper(this.wapersService.viewer.waper.next);
    } else {
      if (!this.wapersService.viewer.waperTable.nomore) {
        this.wapersService.viewer.waperTable.getDatas();
        setTimeout(() => {
          this.next();
        }, 500);
      }
    }
  }

  close(): void {
    this.wapersService.setViewerWaper(null);
  }

  download(type: number) {
    const waper = this.wapersService.viewer.waper;
    const data: any = {
      code: 3,
      tag: 3,
      filetype: 3,
      param: {
        count: 1,
        list: [
          {
            id: waper.id,
            md5: waper.md5,
            path: waper.largeurl,
            name: '爱思壁纸_' + waper.id,
          }
        ]
      },
    };
    if (type === 1) {
      // 下载到电脑
      data.udid = '';
    } else {
      if (!this.pccService.activedDevice) {
        return false;
      }
      data.udid = this.pccService.activedDevice.udid;
      switch (type) {
        case 2:
          // 导入到设备图库
          data.importtype = 1;
        break;
        case 3:
          // 导入到设备相册
          data.importtype = 2;
        break;
      }
    }
    this.pccService.downloadWaper(data);
  }
}
