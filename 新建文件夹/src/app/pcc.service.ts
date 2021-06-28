import { Injectable, ChangeDetectorRef } from '@angular/core';

import { QWebChannel } from './QWebChannel';

import { DlogService } from './dlog.service';
import { asTextData } from '@angular/core/src/view';

@Injectable({
  providedIn: 'root'
})
export class PccService {

  pcVs = '0';
  pcTest = 0;

  // 设备列表
  devices = [];
  // 当前设备
  activedDevice = null;

  // 当前设备中的应用信息
  deviceApps = [];
  // 当前设备model
  model = null;
  // 当前设备osversion
  osversion = null;
  // 当前详情应用ID
  appid = null;

  // 绑定的apple id
  // bindedAppleID = null;

  private webClientContext: any;
  private messageQueue = [];


  // 切换设备回调方法
  changeDeviceCallbacks: any[] = [];

  constructor(
    private dlogService: DlogService
  ) {
    if (typeof window['qt'] !== 'undefined') {
      const qwc = new QWebChannel(window['qt'].webChannelTransport, channel => {
        this.webClientContext = channel.objects.webClient;

        // 发送队列中的消息
        for (let i = 0; i < this.messageQueue.length; ++i) {
          this.sendClientMessage(this.messageQueue[i]);
        }

      });
    }

    // // 初始化PC端信息
    // const url = window.location.href;
    // if (url.indexOf('?') !== -1) {
    //   const str = url.substr(url.indexOf('?') + 1);
    //   const strs = str.split('&');
    //   for (let i = 0; i < strs.length; i++) {
    //     if (strs[i].split('=')[0] === 'pc_vs') {
    //       this.pcVs = strs[i].split('=')[1];
    //     }
    //     if (strs[i].split('=')[0] === 'pc_test') {
    //       this.pcTest = parseInt(strs[i].split('=')[1], 0);
    //     }
    //   }
    // }
  }

  sendClientMessage(data: any) {
    this.dlogService.add(data, 'sendClientMessage');
    if (this.webClientContext) {
      this.webClientContext.someFoo(JSON.stringify(data));
    } else {
      // 未初始化成功时，将消息添加到消息队列，等待初始化成功后再发送
      this.messageQueue.push(data);
    }
  }

  // 发送消息 下载APP 到客户端
  downloadApp(app: any): void {
    const data = {
      code: 1,
      tag: 1,
      filetype: 1,
      udid: this.activedDevice ? this.activedDevice.udid : '',
      param: {
        count: 1,
        list: [app]
      },
    };
    this.sendClientMessage(data);
  }

  // 发送消息 下载壁纸 到客户端
  // @type 为1则只下载，其它值导入到设备
  downloadWaper(data: any): void {
    this.sendClientMessage(data);
  }

  // 发送消息 下载铃声 到客户端
  downloadRing(ring: any): void {
    ring.m4rpath = ring.m4rpath || ring.m4r;
    ring.m4rbyte = ring.m4rbyte || ring.m4rsize;
    const data = {
      code: 2,
      tag: 2,
      filetype: 2,
      udid: this.activedDevice ? this.activedDevice.udid : '',
      param: {
        count: 1,
        list: [ring]
      }
    };
    this.sendClientMessage(data);
  }

  // 下载固件
  downloadFirmware(data: any): void {
    this.sendClientMessage(data);
  }

  // 发送消息 铃声制作 到客户端
  makeRing(): void {
    const data = {
      code: 15,
      tag: 2,
      udid: this.activedDevice ? this.activedDevice.udid : '',
      param: {
        wid: 0
      }
    };
    this.sendClientMessage(data);
  }

  // 设置切换设备回调方法
  setChangeDeviceCallback(func): void {
    this.changeDeviceCallbacks.push(func);
  }

  // 切换设备
  // #isset 是否是设置设备
  changeDevice(device, isSet?): void {
    this.activedDevice = device;
    if(this.activedDevice){
      this.model = this.activedDevice.model;
      this.osversion = this.activedDevice.osversion;
    }
    
    // 发送消息 当前设备信息 到客户端
    // 发送此消息后，客户端才会向页面回传设备应用信息
    this.sendClientMessage({
      code: 4,
      tag: 1,
      udid: this.activedDevice ? this.activedDevice.udid : ''
    });

    if (!isSet) {
      // 发送切换设备消息到客户端 以让PC端通知其它页面切换了设备
      this.sendClientMessage({
        code: 10,
        tag: 1,
        udid: this.activedDevice ? this.activedDevice.udid : ''
      });
    }

    // 切换设备回调
    for (let i = 0; i < this.changeDeviceCallbacks.length; ++i) {
      this.changeDeviceCallbacks[i](device);
    }
  }

  // 发送消息 查看绑定苹果ID 到客户端
  // MAC版本暂无此功能。。。
  // viewBindAppleID(): void {
  //   const data = {
  //     code: 12,
  //     tag: 1,
  //   };
  //   this.sendClientMessage(data);
  // }

  // 设定设备应用信息
  setDeviceApps(dapps: any) {
    this.dlogService.add(dapps, 'setDeviceApps');
    this.deviceApps = dapps;
  }

  // 格式化应用状态
  formatDeviceAppStatus(app: any, type: number): any {
    switch (type) {
      case 0:
        let status = this.activedDevice ? 200 : 100;
        if (
          (this.activedDevice && [1, 2, 3, 4, 6].indexOf(app.status) > -1)
          || (!this.activedDevice && [1, 2, 6].indexOf(app.status) > -1)
        ) {
          status += app.status;
        }
        app.status = status;
        break;
      case 1:
        app.status = 204;
        break;
    }
    app.downId = app.bundleid + "_" + app.shortversion;
    return app;
  }

  getJail(): number {
    // 不再区分越狱资源
    // if (this.activedDevice) {
    //   return this.activedDevice.jail;
    // }
    return 0;
  }

  setDevices(devices: any) {
    let selectDevice = null;
    this.devices = [];
    for (let i = 0; i < devices.length; ++i) {
      if (devices[i].model) {
        this.devices.push(devices[i]);
        if (devices[i].model.indexOf('iPhone') > -1) {
          devices[i].icon = 'iphone';
        } else {
          devices[i].icon = 'ipad';
        }
      }
      if (devices[i].selected) {
        selectDevice = devices[i];
        this.model = devices[i].model;
        this.osversion = devices[i].osversion;
      }
    }

    this.changeDevice(
      selectDevice ?
        selectDevice
        : (devices.length > 0 ? devices[0] : null)
      , 1);
  }

  getDevices(): any[] {
    return this.devices;
  }

  getActivedDevice(): any {
    return this.activedDevice;
  }

  selectDevice(device): void {
    this.activedDevice = device;
  }

  // getBindedAppleID(): void {
  //   return this.bindedAppleID;
  // }
}
