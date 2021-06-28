import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FirmwaresService } from '../firmwares.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-firmware-table',
  templateUrl: './firmware-table.component.html',
  styleUrls: ['./firmware-table.component.css']
})
export class FirmwareTableComponent implements OnInit, OnChanges {

  /**
   * 设备型号
   */
  @Input() model: any;

  /**
   * iOS 版本
   */
  @Input() ios: any;

  /**
   * 分组类型
   */
  @Input() groupType: any;

  /**
   * 功能筛选
   */
  @Input() funcType: any;

  /**
   * 展示的数据
   */
  datas = [];
  /**
   * 全部数据
   */
  allDatas = [];

  /**
   * 当前连接的设备
   */
  @Input() activedDeivce;


  /**
   * 刷新标志 此标志发生改变时，重新获取数据
   */
  @Input() refreshFlag = 0;

  @Output() navigation: EventEmitter<any> = new EventEmitter();

  // 错误
  error: any = null;
  // 状态
  status = 'none';

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    private firmwaresService: FirmwaresService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
    if (changes.funcType) {
      this.filterByFunc();
    }
  }

  reset(): void {
    this.updateStatus('none');
    this.datas = [];
    this.allDatas = [];
    this.getDatas();
  }

  updateStatus(status, data?: any): void {
    this.status = status;
    this.error = null;
    switch (this.status) {
      // 没有更多数据
      case 'nomore':
        if (this.datas.length === 0) {
          this.error = {
            message: '无固件',
            icon: './assets/no-firmware.png',
            retry: false
          };
        }
        break;
      // 发生错误
      case 'error':
        if (this.datas.length === 0) {
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

  getDatas(): void {
    if (this.status !== 'none') {
      return;
    }
    this.updateStatus('loading');
    this.firmwaresService.getFirmwares(
      new HttpParams()
        .set('model', this.model ? this.model.name : '0')
        .set('ios', this.ios ? this.ios.value : '0')
        .set('seltype', this.groupType.value + '')
        .set('fs', '1')
    ).subscribe(res => {
      if (res.co > 0 && res.list.length > 0) {
        for (let i = 0; i < res.list.length; ++i) {
          this.addFirmware(res.list[i]);
        }
        this.filterByFunc();
      }
      // 手动检查更新
      this.changeDetectorRef.detectChanges();
    }, error => {
      this.updateStatus('error', error);
      // 手动检查更新
      this.changeDetectorRef.detectChanges();
    });
  }

  filterByFunc(): void {
    if (this.allDatas.length === 0 && this.status !== 'loading') {
      return this.updateStatus('nomore');
    }
    if (this.funcType.value === 0) {
      this.datas = this.allDatas;
    } else {
      this.datas = [];
      for (let i = 0; i < this.allDatas.length; ++i) {
        switch (this.funcType.value) {
          case 1:
            if (this.allDatas[i].flash) {
              this.datas.push(this.allDatas[i]);
            }
            break;
          case 2:
            if (this.allDatas[i].jailbreak) {
              this.datas.push(this.allDatas[i]);
            }
            break;
          case 3:
            if (this.allDatas[i].flash && this.allDatas[i].jailbreak) {
              this.datas.push(this.allDatas[i]);
            }
            break;
        }
      }
      if (this.datas.length === 0) {
        return this.updateStatus('nomore');
      }
    }
    this.updateStatus('none');

    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

  addFirmware(firmware): void {
    switch (firmware.isSetup) {
      case 20:
        firmware.jailbreak = false;
        firmware.jailbreakTitle = '不可越狱';
        break;
      case 80:
        firmware.jailbreak = true;
        firmware.jailbreakTitle = '可不完美越狱';
        break;
      case 120:
        firmware.jailbreak = true;
        firmware.jailbreakTitle = '可完美越狱';
        break;
    }
    switch (firmware.productState) {
      case 0:
        firmware.flash = false;
        firmware.flashTitle = '未设置';
        break;
      case 30:
        firmware.flash = false;
        firmware.flashTitle = '不可刷';
        break;
      case 60:
        firmware.flash = true;
        firmware.flashTitle = '可随意刷此版本';
        break;
      case 90:
        firmware.flash = true;
        firmware.flashTitle = '可平刷';
        break;
      case 120:
        firmware.flash = true;
        firmware.flashTitle = '有SHSH则可以随意刷';
        break;
    }
    this.allDatas.push(firmware);
  }

  download(firmware) {
    this.pccService.downloadFirmware({
      code: 8,
      tag: 8,
      filetype: 4,
      param: {
        count: 1,
        list: [
          {
            id: firmware.id,
            name: firmware.productName,
            model: firmware.productType,
            ios: firmware.iosVersion,
            url: firmware.downUrl,
            bytesize: firmware.byteSize,
            md5: firmware.md5,
            version: firmware.version
          }
        ]
      }
    });
  }

}
