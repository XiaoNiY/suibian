import {
  Component, OnInit, OnChanges,
  SimpleChanges, Input, Output,
  EventEmitter, ViewChild, HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { WapersService } from '../wapers.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-waper-table',
  templateUrl: './waper-table.component.html',
  styleUrls: ['./waper-table.component.css']
})
export class WaperTableComponent implements OnInit, OnChanges {
  /**
   * 标题
   */
  @Input() title = '';
  /**
   * 模块ID
   * 1：精选
   * 21：周排行
   * 22：月排行
   * 23：总排行
   * 3：最新
   * 4：分类
   */
  @Input() remd = 1;
  /**
   * 设备
   */
  @Input() model: any;
  /**
   * 分类ID
   */
  @Input() typeid = 0;
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

  @ViewChild('pagecontent') pagecontent;

  @Output() navigation: EventEmitter<any> = new EventEmitter();

  // 错误
  error: any = null;
  // 状态
  status = 'none';

  constructor(
    public dlogService: DlogService,
    public wapersService: WapersService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.autoLoadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      this.reset();
    }
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
            message: this.keyword ? '无搜索内容' : '无壁纸',
            icon: this.keyword ? './assets/no-search.png' : './assets/no-waper.png',
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
    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

  getDatas(): void {
    if (this.status !== 'none') {
      return;
    }
    this.updateStatus('loading');
    if (!this.keyword) {
      const obsRes: Observable<any> = this.wapersService.getWapers(
        new HttpParams()
        .set('typeid', this.typeid + '')
        .set('remd', this.remd + '')
        .set('model', this.model.value)
        .set('pageno', this.pageno + ''));
      obsRes.subscribe(res => {
        if (res.co > 0) {
          if (res.list.length === 0) {
            return this.updateStatus('nomore');
          } else {
            for (let i = 0; i < res.list.length; ++i) {
              this.pushWaper(res.list[i]);
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
    const obsRes: Observable<any> = this.wapersService.search(
      new HttpParams()
      .set('fti', '4')
      .set('keyword', this.keyword)
      .set('model', this.model.value)
      .set('pageno', this.pageno + ''));
    obsRes.subscribe(res => {
      if (res.count > 0) {
        if (res.list.length === 0) {
          return this.updateStatus('nomore');
        } else {
          for (let i = 0; i < res.list.length; ++i) {
            if (res.list[i].id !== -100) {
              this.pushWaper(res.list[i]);
            }
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
  }

  pushWaper(waper) {
    // 生成链表 优化查询速度
    const count = this.datas.length;
    if (count) {
      waper.prev = this.datas[count - 1];
      this.datas[count - 1].next = waper;
    }

    this.datas.push(waper);
    this.loadMiddleImage(waper);
  }

  loadMiddleImage(waper) {
    if (!waper || waper.middleImage || waper.middleImageLoading) {
      return;
    }
    waper.middleImageLoading = true;
    const image = new Image();
    image.onerror = () => {
      setTimeout(() => {
        this.loadMiddleImage(waper);
      }, 500);
    };
    image.onload = function() {
      waper.middleImage = this;
      waper.middleImageLoading = false;
      return true;
    };
    image.src = waper.middleurl;
  }

  loadIargeImage(waper) {
    if (!waper || waper.iargeImage || waper.iargeImageLoading) {
      return;
    }
    waper.iargeImageLoading = true;
    const image = new Image();
    image.onerror = () => {
      setTimeout(() => {
        this.loadIargeImage(waper);
      }, 500);
    };
    image.onload = function() {
      waper.iargeImage = this;
      waper.iargeImageLoading = false;
      return true;
    };
    image.src = waper.largeurl;
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

  viewWaper($event): void {
    this.wapersService.setViewer(this, $event);
  }

  selectModel($event): void {
    this.navigation.emit({
      ptype: 'wapers',
      remd: this.remd,
      model: $event,
      title: this.title,
      keyword: this.keyword,
    });
  }

}
