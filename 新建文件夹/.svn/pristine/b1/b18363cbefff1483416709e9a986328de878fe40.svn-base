import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';

import { PageHistoryService } from '../page-history.service';
import { RingsService } from '../rings.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-ring',
  templateUrl: './ring.component.html',
  styleUrls: ['./ring.component.css']
})
export class RingComponent implements OnInit {

  activedNav: any;

  pages: any[] = [];
  activedPage: any;

  typeSelect: any;

  // https://app4.i4.cn/ring4_n.html?pc_vs=
  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    public ringsService: RingsService,
    public pageHistoryService: PageHistoryService,
    private sanitizer: DomSanitizer,
    private audioService: AudioService
  ) {
    // 发送消息 页面加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 0,
      tag: 2,
    });

    this.activedNav = this.ringsService.nav[0];

    this.typeSelect = {
      id: 'select-searchRingType',
      options: this.ringsService.searchTypes,
      selected: this.ringsService.searchTypes[0]
    };
  }

  // 监听消息  酷音铃声下载 会向本页面发送消息
  @HostListener('window:message', ['$event'])
  onmessage($event) {
    try {
      this.dlogService.add($event, 'ring.window:message');
      if ($event.data) {
        const ring = {
          id: 0,
          name: '',
          stype: 0,
          duration: 0,
          m4rpath: '',
          m4rbyte: 0,
        };
        const messageData = JSON.parse($event.data);
        for (const key of Object.keys(messageData)) {
          ring[key] = messageData[key];
        }
        this.pccService.downloadRing(ring);
      }
    } catch (e) {

    }
  }

  ngOnInit() {
    // 发送消息 页面数据加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 10,
      tag: 2,
    });
  }

  navigation(nav) {
    this.dlogService.add(nav, 'ring.navigation');

    let ptype: string;
    let pid: string;
    if (nav) {
      if (nav.ptype === 'makeRing') {
        this.pccService.makeRing();
        return;
      }
      ptype = nav.ptype;
    }
    // 切换搜索类型
    this.typeSelect.selected = this.ringsService.searchTypes[ptype === 'iframe' ? 1 : 0];

    if (ptype === 'iframe') {
      pid = JSON.stringify({
        ptype: ptype,
        partnerName: nav.partnerName,
      });
      // 切出爱思铃声时，停止当前正在播放的铃声
      this.audioService.pause();
    } else if (ptype === 'rings') {
      pid = JSON.stringify({
        ptype: ptype,
        remd: nav.remd,
        ringType: nav.ringType || 0,
        keyword: nav.keyword || '',
      });
      // 切入爱思铃声时，为了停止第三方页面音乐，重置第三方页面
      this.refreshIframe(this.activedPage);
    } else if (ptype === 'classify') {
      pid = JSON.stringify({
        ptype: ptype,
        remd: nav.remd,
        ringType: nav.ringType || 0,
        keyword: nav.keyword || '',
      });
    }
    let page = this.getPage(pid);
    if (!page) {
      if (ptype === 'iframe') {
        page = {
          ptype: ptype,
          pid: pid,
          partnerName: nav.partnerName,
          src: nav.src,
          title: nav.title || '',
          refreshFlag: 0,
        };
      } else if (ptype === 'rings') {
        page = {
          ptype: ptype,
          pid: pid,
          remd: nav.remd,
          ringType: nav.ringType || 0,
          keyword: nav.keyword || '',
          title: nav.title || '',
          refreshFlag: 0,
        };
      } else if ( ptype === 'classify') {
        page = {
          ptype: ptype,
          pid: pid,
          remd: nav.remd,
          ringType: nav.ringType || 0,
          keyword: nav.keyword || '',
          title: nav.title || '',
          refreshFlag: 0,
        };
      }
      this.pages.push(page);
    }
    // 更新src
    if (page.ptype === 'iframe') {
      page.src = nav.src;
    }
    // 导航
    this.paging(page);
    this.pageHistoryService.add(this.activedPage);
  }

  classifyNavigation(classify) {
    this.navigation({
      title: classify.name,
      ptype: 'rings',
      ringType: classify,
      remd: 4
    });
  }

  paging($event) {
    this.dlogService.add($event, 'ring.paging');
    const page = typeof $event === 'string' ? this.getPage($event) : $event;
    if (page) {
      this.activedPage = page;

      // 主动触发一次 onResize 事件
      // 使当前页面触发 resize 检测
      setTimeout(() => {
        const ev = document.createEvent('HTMLEvents');
        ev.initEvent('resize', true, true);
        window.dispatchEvent(ev);
      }, 200);

      if (page.keyword) {
        this.activedNav = null;
        return;
      }
      // 同步导航
      const ddnav = function(nav) {
        if (nav.ptype !== page.ptype) {
          return false;
        }
        return nav.remd === page.remd
          && (this.activedNav = nav);
      }.bind(this);
      this.ringsService.nav.map(nav => {
        if (nav.children && nav.children.length > 0) {
          nav.children.map(cnav => ddnav(cnav));
        } else {
          ddnav(nav);
        }
      });
    }
  }

  // 刷新页面
  refreshing($event): void {
    if (this.activedPage.ptype === 'iframe') {
      this.refreshIframe(this.activedPage);
    } else {
      this.activedPage.refreshFlag = !this.activedPage.refreshFlag;
    }
    this.dlogService.add(this.activedPage, 'ring.refreshing');
  }

  // 刷新第三方页面
  refreshIframe(page) {
    if (page.ptype === 'iframe') {
      const src = page.src;
      if (src) {
        page.src = '';
        setTimeout(() => {
          page.src = src;
        }, 500);
      }
    }
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
    this.dlogService.add($event, 'ring.changeDevice');
  }

  toKuyinSearch($event): void {
    this.navigation({
      ptype: 'iframe',
      partnerName: 'kuyin',
      src: this.sanitizer.bypassSecurityTrustResourceUrl(
        this.dlogService.protocol + '//kyyapp.kuyinxiu.com/s1/16caaeab24cadb55?psrc=102&kw=' + $event
      )
    });
  }

  search($event): any {
    if ($event.typeSelected.value === 1) {
      this.navigation({
        ptype: 'rings',
        keyword: $event.keyword
      });
    } else {
      this.toKuyinSearch($event.keyword);
    }
  }

  keywordSuggests($event): any {
    if ($event.typeSelected.value === 2) {
      // 酷音铃声不提供搜索提示
      return;
    }
    this.ringsService.getKeywordSuggests($event.keyword);
  }
}
