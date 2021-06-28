import { Component, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { DlogService } from './dlog.service';
import { PccService } from './pcc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'macResource';

  @Input() page: string;

  keys: boolean[] = [];

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    for (let i = 0; i < 256; ++i) {
      this.keys[i] = false;
    }
    window.onerror = (errorMessage, scriptURI, lineNumber) => {
      this.dlogService.add(errorMessage, 'onerror');
    };
    // 兼容旧版
    window['i4common'] = {
      // 客户端回调
      clientCallPage: $event => {
        const message = JSON.parse($event);
        this.dlogService.add(message, 'clientCallPage');
        switch (message.code) {
          // 设备信息
          case 10:
            this.pccService.setDevices([]);
            if (message.device) {
              this.pccService.setDevices(message.device);
            }
            break;
          // 本地、设备应用列表
          case 4:
            const apps = {};
            if (message.param.local && message.param.local.length > 0) {
              for (let i = 0; i < message.param.local.length; ++i) {
                const app = this.pccService.formatDeviceAppStatus(message.param.local[i], 0);
                apps[app.downId] = app;
              }
            }

            if (message.param.device && message.param.device != "null" && message.param.device.length > 0) {
              for (let i = 0; i < message.param.device.length; ++i) {
                const app = this.pccService.formatDeviceAppStatus(message.param.device[i], 1);
                apps[app.downId] = app;
              }
            }

            this.pccService.setDeviceApps(apps);
            break;
          // 应用下载状态变更
          case 1:
            break;
          // PC端版本
          case 17:
            break;
        }
        // 手动检查更新 铃声和壁纸页面 收到消息后页面不会自动更新。。。
        this.changeDetectorRef.detectChanges();
      }
    };

    window['i4app'] = {
      callbackByDeviceUpdate: function ($event) {
        this.dlogService.add($event, 'callbackByDeviceUpdate');
      }
    };
  }

  @HostListener('window:contextmenu', ['$event'])
  onContextmenu($event) {
    // const res = this.comperVersion(this.pccService.pcVs, '7.11.008');
    // this.dlogService.add(res, 'contextmenu');
    // if (res < 1) {
    //   return false;
    // }
  }

  // 禁止页面缩放
  @HostListener('window:mousewheel', ['$event'])
  onMouseWheel($event) {
    const e = $event || window.event;
    if (e.wheelDelta && $event.ctrlKey) {
      $event.returnValue = false;
    } else if (e.detail) {
      $event.returnValue = false;
    }
  }

  // 切换debug模式
  @HostListener('window:keydown', ['$event'])
  onKeydown($event) {
    const e = $event || window.event;
    this.keys[e.keyCode] = true;
  }
  @HostListener('window:keyup', ['$event'])
  onkeyup($event) {
    const e = $event || window.event;
    this.keys[e.keyCode] = false;
    // alt + ctrl + shift + b + u + g
    if (e.altKey && e.ctrlKey && e.shiftKey && this.keys[66] && this.keys[85] && e.keyCode === 71) {
      this.dlogService.debug = !this.dlogService.debug;
      e.returnValue = false;
    }
  }


  comperVersion(v1: string, v2: string) {
    let re = 0;
    const v1_ar = v1.split('.');
    const v2_ar = v2.split('.');
    for (let i = 0; i < v1_ar.length && i < v2_ar.length; i++) {
      if (parseInt(v1_ar[i], 0) > parseInt(v2_ar[i], 0)) {
        re = 1;
        break;
      } else if (parseInt(v1_ar[i], 0) < parseInt(v2_ar[i], 0)) {
        re = -1;
        break;
      } else {
        re = 0;
      }
    }
    if (re === 0) {
      if (v1_ar.length > v2_ar.length) {
        re = 1;
      } else if (v1_ar.length > v2_ar.length) {
        re = -1;
      } else {
        re = 0;
      }
    }
    return re;
  }
}
