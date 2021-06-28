import { Component, OnInit, Input, Output, EventEmitter, enableProdMode, OnChanges, SimpleChanges } from '@angular/core';
import { AppsService } from '../apps.service';
import { HttpParams } from '@angular/common/http';
import { trigger, state, animate, transition, style } from '@angular/animations';
import { DlogService } from '../dlog.service';

// 去除检查警告
enableProdMode();

@Component({
  selector: 'app-app-banner',
  templateUrl: './app-banner.component.html',
  styleUrls: ['./app-banner.component.css'],
  animations: [
    trigger('bannerTransition', [
      state('left', style({ left: '-100%' })),
      state('right', style({ left: '100%' })),
      state('active', style({ left: 0 })),
      transition('active => left', animate('400ms ease-in-out', style({ left: '-100%' }))),
      transition('right => left', animate('1ms ease-in-out', style({ left: '-100%' }))),
      transition('active => right', animate('400ms ease-in-out', style({ left: '100%' }))),
      transition('left => right', animate('1ms ease-in-out', style({ left: '100%' }))),
      transition('* => active', animate('400ms ease-in-out', style({ left: 0 }))),
    ])
  ]
})
export class AppBannerComponent implements OnInit, OnChanges {

  @Input() model;
  @Input() jail;

  banners = [];
  actived = null;
  timer: any;
  controllerDisplay = false;

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
    public appsService: AppsService,
    public dlogService: DlogService
  ) { }

  ngOnInit() {
    this.getBanners();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.banners = [];
    this.actived = null;
    this.controllerDisplay = false;
    this.updateStatus('none');
    this.getBanners();
  }

  updateStatus(status, data?: any): void {
    this.status = status;
    this.error = null;
    switch (this.status) {
      // 没有更多数据
      case 'nomore':
        if (this.banners.length === 0) {
          this.error = {
            message: '无应用信息',
            icon: './assets/no-apps.png',
            retry: false
          };
        }
        break;
      // 发生错误
      case 'error':
        if (this.banners.length === 0) {
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

  getBanners(): void {
    if (this.status !== 'none') {
      return;
    }
    this.updateStatus('loading');
    this.appsService.getBanners(
      new HttpParams()
      .set('model', this.model)
      .set('isjail', this.jail + '')
    ).subscribe(res => {
      if (res.co > 0) {
        for (let i = 0; i < res.list.length; ++i) {
          const banner = res.list[i];
          banner.index = i;
          banner.state = i ? 'right' : 'active';
          banner.prev = i ? res.list[i - 1] : res.list[res.list.length - 1];
          banner.next = i < res.list.length - 1 ? res.list[i + 1] : res.list[0];
          this.banners.push(banner);
        }
        this.actived = this.banners[0];
        this.autoPlay();
      }
      this.updateStatus('nomore');
    }, error => {
      this.updateStatus('error', error);
    });
  }

  // 跳转
  // @type  跳转方式 0顺序跳转 1直接跳转
  to(banner: any, type: number): void {
    if (this.actived === banner) {
      return;
    }
    // 预置位置
    let nextSate = '';
    if (type === 0 && banner.index === 0 && this.actived.index === this.banners.length - 1) {
      banner.state = 'right';
      nextSate = 'left';
    } else if (type === 0 && banner.index === this.banners.length - 1 && this.actived.index === 0) {
      banner.state = 'left';
      nextSate = 'right';
    } else {
      banner.state = banner.index > this.actived.index ? 'right' : 'left';
      nextSate = banner.index > this.actived.index ? 'left' : 'right';
    }
    setTimeout(() => {
      // 更新位置
      this.actived.state = nextSate;
      this.actived = banner;
      this.actived.state = 'active';
    }, 100);
  }

  autoPlay(): void {
    if (this.banners.length > 1) {
      this.timer = setInterval(() => {
        this.to(this.actived.next, 0);
      }, 3000);
      this.controllerDisplay = false;
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.controllerDisplay = true;
    }
  }

  viewDetail($event): void {
    if ($event.type === '2') {
      this.navigation.emit({
        ptype: 'detail',
        detailParams: {
          id: $event.appid,
          pkagetype: $event.pkagetype,
          form: 1
        }
      });
    }
  }
}
