import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { AppsService } from '../apps.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-app-tables',
  templateUrl: './app-tables.component.html',
  styleUrls: ['./app-tables.component.css']
})
export class AppTablesComponent implements OnInit, OnChanges {
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
   * 是否授权（默认已授权）
   * 1：已授权
   * 2：未授权
   */
  @Input() auth = 1;
  /**
   * 主类别
   * 1：应用
   * 2：游戏
   * 0：全部
   */
  @Input() sort = 0;
  /**
   * 分类ID 默认0全部分类
   */
  @Input() appType: any;
  /**
   * 模块ID
   * 1：精选
   * 2：专题
   * 3：应用/游戏推荐
   * 6：分类推荐
   * 9：搜索
   * 41：应用/游戏总排行
   * 43：应用/游戏月排行
   * 44：应用/游戏流行
   * 71：分类总排行
   * 73：分类月排行
   * 74：分类流行
   */
  @Input() remd = 1;
  /**
   * 专题ID
   */
  @Input() specialid = 0;
  /**
   * 专题图片
   */
  @Input() specialimage: string;
  /**
   * 是否高清
   * 1：高清
   * 0：全部
   */
  @Input() hd = 1;
  /**
   * 个人签
   */
  @Input() ts = 1;
  /**
   * 关键字
   */
  @Input() keyword = '';

  /**
   * 数据
   */
  datas = [];
  /**
   * 分页
   */
  pageno = 1;
  /**
   * 当前查看的页
   */
  viewPageno = 1;

  /**
   * 刷新标志 此标志发生改变时，重新获取数据
   */
  @Input() refreshFlag = 0;

  searchCount = 0;

  @Output() navigation: EventEmitter<any> = new EventEmitter();

  @ViewChild('pagecontent') pagecontent;

  // 错误
  error: any = null;
  // 状态
  status = 'none';

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    public appsService: AppsService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.autoLoadData();
  }

  getHttpParam(): HttpParams {
    return new HttpParams()
      .set('model', this.model)
      .set('isjail', this.jail + '')
      .set('isAuth', this.auth + '')
      .set('sort', this.sort + '')
      .set('type', this.appType.value + '')
      .set('remd', this.remd + '')
      .set('pageno', this.pageno + '')
      .set('specialid', this.specialid + '')
      .set('hd', this.hd + '')
      .set('ts', this.ts + '');
  }

  reset(): void {
    this.error = null;
    this.updateStatus('none');
    this.pageno = 1;
    this.viewPageno = 1;
    this.datas = [];

    this.getDatas();
  }

  updateStatus(status, data?: any): void {
    this.status = status;
    switch (this.status) {
      // 没有更多数据
      case 'nomore':
        if (this.pageno === 1) {
          this.error = {
            message: this.keyword ? '无搜索内容' : '无应用',
            icon: this.keyword ? './assets/no-search.png' : './assets/no-apps.png',
            retry: false
          };
        }
        break;
      // 发生错误
      case 'error':
        if (this.pageno === 1) {
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
    if (!this.keyword) {
      const obsRes: Observable<any> = this.appsService.getApps(this.getHttpParam());
      obsRes.subscribe(res => {
        if (res.co > 0) {
          if (res.list.length === 0) {
            return this.updateStatus('nomore');
          } else {
            for (let i = 0; i < res.list.length; ++i) {
              this.datas.push(this.appsService.formatApp(res.list[i]));
            }
            this.pageno++;
          }
        } else {
          return this.updateStatus('nomore');
        }
        // 每次请求数据间隔最小时间
        setTimeout(() => {
          this.updateStatus('none');
          this.autoLoadData();
        }, 500);
      }, error => {
        this.updateStatus('error', error);
      });
    } else {
      // 搜索
      this.searchDatas();
    }
  }

  searchDatas() {
    this.appsService.search(new HttpParams()
      .set('reqtype', '100')
      .set('ft', this.jail === 1 ? '1' : '3')
      .set('page', this.pageno + '')
      .set('model', this.model === 'iPhone' ? '101' : '102')
      .set('isHd', this.model === 'iPad' ? '1' : '0')
      .set('isTs', this.ts + '')
      .set('rows', '20')
      .set('keyword', this.keyword)
    ).subscribe(res => {
      if (res.status === 0) {
        if (this.pageno === 1) {
          this.searchCount = res.result.count;
        }
        if (res.result.list.length === 0) {
          return this.updateStatus('nomore');
        } else {
          for (let i = 0; i < res.result.list.length; ++i) {
            this.datas.push(this.appsService.formatApp(res.result.list[i]));
          }
          this.pageno++;
        }
      } else {
        return this.updateStatus('nomore');
      }
      // 每次请求数据间隔最小时间
      setTimeout(() => {
        this.updateStatus('none');
        this.autoLoadData();
      }, 500);
      this.dlogService.add(this.pageno, 'pageno');
    }, error => {
      this.updateStatus('error', error);
    });
  }

  // 自适应加载数据
  autoLoadData() {
    if (this.status !== 'none') {
      return;
    }
    setTimeout(function() {
      const contentHeight = this.pagecontent.nativeElement.scrollHeight;
      const screenHeight = document.getElementsByClassName('layout')[0].scrollHeight;
      if (contentHeight) {
        if (
          // 数据不满一屏时
          contentHeight - 100 < screenHeight
          // 当前滚动条在底部时（快速滚动时有可能出现此情况）
          || contentHeight - screenHeight - 100 < this.pagecontent.nativeElement.scrollTop
        ) {
          this.getDatas();
        }
      }
    }.bind(this), 500);
  }

  selectApp(app): void {
    this.navigation.emit({
      ptype: 'detail',
      detailParams: {
        id: app.id,
        pkagetype: app.pkagetype,
        from: 1
      }
    });
  }

  selectType($event): void {
    this.navigation.emit({
      ptype: 'apps',
      title: this.title || '',
      remd: this.getTypeRemd($event),
      sort: this.sort,
      appType: $event
    });
  }

  getTypeRemd(t): number {
    if (t.value === 0) {
      // 推荐分类跳推荐
      if (this.remd === 6) {
        return 3;
      }
      // 流行分类跳流行
      if (this.remd === 74) {
        return 44;
      }
    } else {
      // 推荐跳推荐分类
      if (this.remd === 3) {
        return 6;
      }
      // 流行跳流行分类
      if (this.remd === 44) {
        return 74;
      }
    }
    return this.remd;
  }

  changeHD(): void {
    this.navigation.emit({
      ptype: 'apps',
      title: this.title || '',
      remd: this.remd,
      hd: this.hd ? 0 : 1,
    });
  }

  onScroll(e): void {
    const pcEl = e.target;
    if (pcEl.scrollHeight - pcEl.offsetHeight - pcEl.scrollTop < 100) {
      this.getDatas();
    }
    this.viewPageno = Math.ceil(
      (
        (pcEl.scrollTop || 1)
        + document.getElementById('layout').offsetHeight / 2
      )
      / document.getElementById('layout').offsetHeight
    );
  }

}
