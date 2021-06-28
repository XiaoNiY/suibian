import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { RingsService } from '../rings.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AudioService } from '../audio.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-ring-table',
  templateUrl: './ring-table.component.html',
  styleUrls: ['./ring-table.component.css']
})
export class RingTableComponent implements OnInit, OnChanges {
  /**
   * 标题
   */
  @Input() title = '';
  /**
   * 模块ID
   * 1：精选铃声
   * 21：周排行
   * 22：月排行
   * 23：总排行
   * 3：最新
   * 4：分类
   */
  @Input() remd = 1;
  /**
   * 分类
   */
  @Input() ringType: any;

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

  @Output() kuyinSearch: EventEmitter<any> = new EventEmitter();
  @Output() navigation: EventEmitter<any> = new EventEmitter();

  searchCount = 0;

  @ViewChild('pagecontent') pagecontent;

  // 错误
  error: any = null;
  // 状态
  status = 'none';

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    private ringsService: RingsService,
    private audioService: AudioService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshFlag) {
      // 如果当前正在播放的铃声是本页面的铃声，则停止播放
      for (let i = 0; i < this.datas.length; ++i) {
        if (this.audioService.playData === this.datas[i]) {
          this.audioService.pause();
        }
      }
      this.reset();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.autoLoadData();
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
            message: this.keyword ? '无搜索内容' : '无铃声',
            icon: this.keyword ? './assets/no-search.png' : './assets/no-ring.png',
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

  getDatas(successCallback?: any): void {
    if (this.status !== 'none') {
      return;
    }
    this.updateStatus('loading');
    if (!this.keyword) {
      const obsRes: Observable<any> = this.ringsService.getRings(new HttpParams()
      .set('rtid', (this.remd !== 4 ? 0 : this.ringType.id) + '')
      .set('remd', this.remd + '')
      .set('pageno', this.pageno + ''));
      obsRes.subscribe(res => {
        if (res.co > 0) {
          if (res.list.length === 0) {
            return this.updateStatus('nomore');
          } else {
            for (let i = 0; i < res.list.length; ++i) {
              this.addRing(res.list[i]);
            }
            this.pageno++;
            if (successCallback) {
              successCallback();
            }
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
      this.searchDatas(successCallback);
    }
  }

  searchDatas(successCallback?: any) {
    this.ringsService.search(new HttpParams()
      .set('reqtype', '100')
      .set('page', this.pageno + '')
      .set('rows', '20')
      .set('keyword', this.keyword)
      .set('ft', '5')
    ).subscribe(res => {
      if (res.status === 0) {
        if (this.pageno === 1) {
          this.searchCount = res.result.count;
        }
        if (res.result.list.length === 0) {
          return this.updateStatus('nomore');
        } else {
          for (let i = 0; i < res.result.list.length; ++i) {
            this.addSearchRing(res.result.list[i]);
          }
          this.pageno++;
          if (successCallback) {
            successCallback();
          }
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

  addRing(ring): void {
    ring.rtypeid = parseInt(ring.rtypeid, 0);
    if (this.ringType && this.ringType.id !== 0 && this.remd !== 4) {
      if (ring.rtypeid !== this.ringType.id) {
        return;
      }
    }
    ring.rtypeName = this.ringsService.getRingType(ring.rtypeid).name;
    if (this.datas.length > 0) {
      this.datas[this.datas.length - 1].next = ring;
    }
    this.datas.push(ring);
  }

  addSearchRing(ring): void {
    this.addRing({
      id: ring.id,
      ricon: ring.icon,
      name: ring.name,
      duration: ring.duration,
      stype: ring.stype,
      m4rpath: 'http://d.ring.i4.cn/audio/' + ring.m4rUrl,
      m4rsize: ring.m4rSize,
      download: ring.downCount,
      mp3: 'http://d.ring.i4.cn/audio/' + ring.mp3Url,
      rtypeid: ring.typeid || 17
    });
  }

  download(ring) {
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

  toKuyinSearch(): void {
    this.kuyinSearch.emit(this.keyword);
  }

  classifyRings(ring: any): void {
    this.navigation.emit({
      title: this.title + ' - ' + ring.rtypeName,
      ptype: 'rings',
      keyword: this.keyword,
      ringType: this.ringsService.getRingType(ring.rtypeid),
      remd: this.remd
    });
  }

  toggleRing(ring, $event) {
    this.audioService.toggle(ring, $event);
    this.dlogService.add([ring.id, ring.name, $event.button === 2], 'ring.toggle');
    // 若是右键点击，则从当前铃声开始顺序播放
    if ($event.button === 2) {
      this.audioService.setEndedCallback(r => {
        if (r.next) {
          this.audioService.toggle(r.next);
        } else {
          this.getDatas(() => {
            this.audioService.toggle(r.next);
          });
        }
      });
      $event.returnValue = false;
    }
  }

}
