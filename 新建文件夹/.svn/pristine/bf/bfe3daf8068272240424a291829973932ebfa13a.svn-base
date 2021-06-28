import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { AppsService } from '../apps.service';
import { HttpParams } from '@angular/common/http';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-app-special',
  templateUrl: './app-special.component.html',
  styleUrls: ['./app-special.component.css']
})
export class AppSpecialComponent implements OnInit, OnChanges {
  /**
   * 标题
   */
  @Input() title = '';
  /**
   * 适用设备
   * iPhone || iPad
   */
  @Input() model = 'iPhone';
  /**
   * 是否越狱
   * 1：已越狱
   * 0：未越狱
   */
  @Input() jail = 0;
  /**
  * 主类别
  * 1：应用
  * 2：游戏
  * 0：全部
  */
  @Input() sort = 0;
  /**
    * 数据
    */
  datas = [];

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
    private dlogService: DlogService
    ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
  }

  reset() {
    this.updateStatus('none');
    this.datas = [];
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
            message: '无专题',
            icon: './assets/no-apps.png',
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
    this.appsService.getSpecials(
      new HttpParams()
      .set('isjail', this.jail + '')
      .set('model', this.model)
      .set('sort', this.sort + '')
    ).subscribe(res => {
      if (res.co > 0) {
        this.datas = this.datas.concat(res.list);
      }
      this.updateStatus('nomore');
    }, error => {
      this.updateStatus('error', error);
    });
  }

  navigateTo(special): void {
    this.navigation.emit({
      ptype: 'apps',
      specialid: special.id,
      specialimage: special.icon3,
      remd: 2
    });
  }

}
