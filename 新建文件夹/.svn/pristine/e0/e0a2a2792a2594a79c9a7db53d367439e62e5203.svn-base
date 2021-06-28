import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';

import { FirmwaresService } from '../firmwares.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-firmware',
  templateUrl: './firmware.component.html',
  styleUrls: ['./firmware.component.css']
})
export class FirmwareComponent implements OnInit {

  activedNav: any;

  pages: any[] = [];
  activedPage: any;

  typeSelect: any;

  // 分组选项
  groupTypes = [
    { value: 1, name: '按设备选择' },
    { value: 2, name: '按iOS版本选择' }
  ];
  groupType = this.groupTypes[0];

  // 设备选项
  deviceTypes = [
    { value: 1, name: 'iPhone' },
    { value: 2, name: 'iPad' },
    { value: 3, name: 'iPod touch' }
  ];
  deviceType = this.deviceTypes[0];

  // iPhone 设备
  iPhoneDevices = [
    { value: 23, name: 'iPhone 11 Pro Max', model: 'iPhone12,5' },
    { value: 22, name: 'iPhone 11 Pro', model: 'iPhone12,3' },
    { value: 21, name: 'iPhone 11', model: 'iPhone12,1' },
    { value: 20, name: 'iPhone XS Max', model: 'iPhone11,4' },
    { value: 19, name: 'iPhone XS', model: 'iPhone11,2' },
    { value: 18, name: 'iPhone XR', model: 'iPhone11,8' },
    { value: 17, name: 'iPhone X', model: 'iPhone10,3' },
    { value: 16, name: 'iPhone 8 Plus', model: 'iPhone10,2' },
    { value: 15, name: 'iPhone 8', model: 'iPhone10,1' },
    { value: 14, name: 'iPhone 7 Plus', model: 'iPhone9,2' },
    { value: 13, name: 'iPhone 7', model: 'iPhone9,1' },
    { value: 12, name: 'iPhone 6s Plus', model: 'iPhone8,2' },
    { value: 11, name: 'iPhone 6s', model: 'iPhone8,1' },
    { value: 10, name: 'iPhone 6 Plus', model: 'iPhone7,1' },
    { value: 9, name: 'iPhone 6', model: 'iPhone7,2' },
    { value: 8, name: 'iPhone SE', model: 'iPhone8,4' },
    { value: 7, name: 'iPhone 5s', model: 'iPhone6,1' },
    { value: 6, name: 'iPhone 5c', model: 'iPhone5,3' },
    { value: 5, name: 'iPhone 5', model: 'iPhone5,1' },
    { value: 4, name: 'iPhone 4s', model: 'iPhone4,1' },
    { value: 3, name: 'iPhone 4', model: 'iPhone3,1' },
    { value: 2, name: 'iPhone 3GS', model: 'iPhone2,1' },
    { value: 1, name: 'iPhone 3G', model: 'iPhone1,2' }
  ];
  iPhoneDevice = this.iPhoneDevices[0];
  // iPad 设备
  iPadDevices = [
    { value: 20, name: 'iPad Pro 3(12.9)', model: 'iPad8,5' },
    { value: 19, name: 'iPad Pro 3(11)', model: 'iPad8,1' },
    { value: 18, name: 'iPad 9.7(2018)', model: 'iPad7,5' },
    { value: 17, name: 'iPad Pro 2(10.5)', model: 'iPad7,3' },
    { value: 16, name: 'iPad Pro 2(12.9)', model: 'iPad7,1' },
    { value: 15, name: 'iPad Pro(12.9)', model: 'iPad6,7' },
    { value: 14, name: 'iPad Pro(9.7)', model: 'iPad6,3' },
    { value: 13, name: 'iPad (9.7)', model: 'iPad6,11' },
    { value: 12, name: 'iPad mini 5', model: 'iPad11,1' },
    { value: 11, name: 'iPad mini 4', model: 'iPad5,1' },
    { value: 10, name: 'iPad mini 3', model: 'iPad4,7' },
    { value: 9, name: 'iPad mini 2', model: 'iPad4,4' },
    { value: 8, name: 'iPad mini', model: 'iPad2,5' },
    { value: 7, name: 'iPad Air 3', model: 'iPad11,3' },
    { value: 6, name: 'iPad Air 2', model: 'iPad5,3' },
    { value: 5, name: 'iPad Air', model: 'iPad4,1' },
    { value: 4, name: 'iPad 4', model: 'iPad3,4' },
    { value: 3, name: 'iPad 3', model: 'iPad3,1' },
    { value: 2, name: 'iPad 2', model: 'iPad2,1' },
    { value: 1, name: 'iPad 1', model: 'iPad1,1' }
  ];
  iPadDevice = this.iPadDevices[0];

  // iPod touch 设备
  iPodTouchDevices = [
    { value: 6, name: 'iPod touch 6', model: 'iPod7,1' },
    { value: 5, name: 'iPod touch 5', model: 'iPod5,1' },
    { value: 4, name: 'iPod touch 4', model: 'iPod4,1' },
    { value: 3, name: 'iPod touch 3', model: 'iPod3,1' },
    { value: 2, name: 'iPod touch 2', model: 'iPod2,1' },
    { value: 1, name: 'iPod touch', model: 'iPod1,1' },
  ];
  iPodTouchDevice = this.iPodTouchDevices[0];

  // iOS 版本分组
  iOSVersionGroups = [
    // { value: 13, name: 'iOS 13' },
    // { value: 12, name: 'iOS 12' },
    // { value: 11, name: 'iOS 11' },
    // { value: 10, name: 'iOS 10' },
    // { value: 9, name: 'iOS 9' },
    // { value: 8, name: 'iOS 8' },
    // { value: 7, name: 'iOS 7' },
    // { value: 6, name: 'iOS 6' },
    // { value: 5, name: 'iOS 5' },
    // { value: 4, name: 'iOS 4' },
    // { value: 3, name: 'iOS 3' },
    // { value: 2, name: 'iOS 2' },
    // { value: 1, name: 'iOS 1' },
  ];
  // iOSVersionGroup = this.iOSVersionGroups[0];
  iOSVersionGroup = null;

  // iOS 版本
  iOSVersions = [];
  iOSVersion = null;

  // 功能选项
  funcTypes = [
    { value: 0, name: '全部' },
    { value: 1, name: '可刷机' },
    { value: 2, name: '可越狱' },
    { value: 3, name: '可刷可越' }
  ];
  funcType = this.funcTypes[0];

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    public firmwaresService: FirmwaresService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // 发送消息 页面加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 0,
      tag: 8,
    });

  }

  ngOnInit() {
    // 发送消息 页面数据加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 10,
      tag: 8,
    });

    // 加载 iOS 版本
    this.firmwaresService.getiOSVersions()
      .subscribe(res => {
        if (res.list && res.list.length > 0) {
          let lt = res.list.length-1;
          for (let i = 0; i < res.list.length; ++i) {

            //添加IOS版本
            this.iOSVersionGroups.push({ value: lt, name: 'iOS ' + res.list[i].ios });
            lt--;
            
            this.iOSVersions[res.list[i].ios] = [];
            for (let j = 0; j < res.list[i].list.length; ++j) {
              const version = res.list[i].list[j].split(';');
              this.iOSVersions[res.list[i].ios].push({
                value: version[0],
                name: version[0] + (version[1].indexOf('beta') > -1 ? '<span class="testVersion">测试版</span>' : ''),
                test: version[1].indexOf('beta') > -1
              });
            }
          }
          this.iOSVersionGroups.pop();

          this.iOSVersionGroup = this.iOSVersionGroups[0];

          this.dlogService.add(this.iOSVersions, 'iOSVersions');
          this.iOSVersion = this.iOSVersions[this.iOSVersions.length - 1][0];
          this.changeGroupType(this.groupType);
        } else {
          // 数据为空则移除 IOS版本选项
          this.groupTypes.splice(1, 1);
          this.dlogService.add(res, 'getiOSVersions Error');
        }
      }, error => {
        this.dlogService.add(error, 'getiOSVersions Error');
      });

    this.pccService.setChangeDeviceCallback(this.changeDevice.bind(this));
  }

  navigation(nav) {
    this.dlogService.add(nav, 'firmware.navigation');

    let pid: string;
    pid = JSON.stringify({
      model: nav.model,
      ios: nav.ios
    });
    let page = this.getPage(pid);
    if (!page) {
      page = {
        pid: pid,
        model: nav.model,
        ios: nav.ios,
        groupType: nav.groupType,
        funcType: nav.funcType,
        refreshFlag: 0,
      };
      this.pages.push(page);
    }
    // 导航
    this.paging(page);
  }

  paging($event) {
    this.dlogService.add($event, 'firmware.paging');
    const page = typeof $event === 'string' ? this.getPage($event) : $event;
    if (page) {
      this.activedPage = page;
    }
  }

  // 刷新页面
  refreshing($event): void {
    this.activedPage.refreshFlag = !this.activedPage.refreshFlag;
    this.dlogService.add(this.activedPage, 'firmware.refreshing');
  }

  getPage(pid: string): any {
    for (let i = 0; i < this.pages.length; ++i) {
      if (this.pages[i].pid === pid) {
        return this.pages[i];
      }
    }
    return null;
  }

  changeDevice($event): void {
    this.dlogService.add($event, 'firmware.changeDevice');
    if ($event) {
      if ($event.model.toLowerCase().indexOf('iphone') > -1) {
        for (let i = 0; i < this.iPhoneDevices.length; ++i) {
          if (this.iPhoneDevices[i].model.toLowerCase() === $event.model.toLowerCase()) {
            this.groupType = this.groupTypes[0];
            this.deviceType = this.deviceTypes[0];
            this.changeiPhoneDevice(this.iPhoneDevices[i]);
          }
        }
      }
      if ($event.model.toLowerCase().indexOf('ipad') > -1) {
        for (let i = 0; i < this.iPadDevices.length; ++i) {
          if (this.iPadDevices[i].model.toLowerCase() === $event.model.toLowerCase()) {
            this.groupType = this.groupTypes[0];
            this.deviceType = this.deviceTypes[1];
            this.changeiPhoneDevice(this.iPadDevices[i]);
          }
        }
      }
    }
  }

  changeFuncType(funcType): void {
    this.funcType = funcType;
    this.dlogService.add(funcType, 'changeFuncType');
    this.activedPage.funcType = this.funcType;
  }

  changeGroupType(groupType): void {
    this.groupType = groupType;
    this.dlogService.add(groupType, 'changeGroupType');
    switch (this.groupType.value) {
      case 1:
        this.changeDeviceType(this.deviceType || this.deviceTypes[0]);
        break;
      case 2:
        this.changeiOSVersionGroup(this.iOSVersionGroup || this.iOSVersionGroups[0]);
        break;
    }
  }

  changeDeviceType(deviceType): void {
    this.deviceType = deviceType;
    this.dlogService.add(deviceType, 'changeDeviceType');
    switch (this.deviceType.value) {
      case 1:
        this.changeiPhoneDevice(this.iPhoneDevice || this.iPhoneDevices[0]);
        break;
      case 2:
        this.changeiPadDevice(this.iPadDevice || this.iPadDevices[0]);
        break;
      case 3:
        this.changeiPodTouchDevice(this.iPodTouchDevice || this.iPodTouchDevices[0]);
        break;
    }
  }

  changeiPhoneDevice(iPhoneDevice): void {
    this.iPhoneDevice = iPhoneDevice;
    this.dlogService.add(iPhoneDevice, 'changeiPhoneDevice');
    this.navigation({
      model: this.iPhoneDevice,
      ios: null,
      groupType: this.groupType,
      funcType: this.funcType
    });
  }

  changeiPadDevice(iPadDevice): void {
    this.iPadDevice = iPadDevice;
    this.dlogService.add(iPadDevice, 'changeiPadDevice');
    this.navigation({
      model: this.iPadDevice,
      ios: null,
      groupType: this.groupType,
      funcType: this.funcType
    });
  }

  changeiPodTouchDevice(iPodTouchDevice): void {
    this.iPodTouchDevice = iPodTouchDevice;
    this.dlogService.add(iPodTouchDevice, 'changeiPodTouchDevice');
    this.navigation({
      model: this.iPodTouchDevice,
      ios: null,
      groupType: this.groupType,
      funcType: this.funcType
    });
  }

  changeiOSVersionGroup(iOSVersionGroup): void {
    this.iOSVersionGroup = iOSVersionGroup;
    this.dlogService.add(iOSVersionGroup, 'changeiOSVersionGroup');
    for (let i = 0; i < this.iOSVersions[this.iOSVersionGroup.value].length; ++i) {
      if (!this.iOSVersions[this.iOSVersionGroup.value][i].test) {
        this.changeiOSVersion(this.iOSVersions[this.iOSVersionGroup.value][i]);
        break;
      }
    }
  }

  changeiOSVersion(iOSVersion): void {
    this.iOSVersion = iOSVersion;
    this.dlogService.add(iOSVersion, 'changeiOSVersion');
    this.navigation({
      model: null,
      ios: this.iOSVersion,
      groupType: this.groupType,
      funcType: this.funcType
    });
  }

}
