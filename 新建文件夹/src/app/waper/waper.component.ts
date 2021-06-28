import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { PageHistoryService } from '../page-history.service';
import { WapersService } from '../wapers.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';


@Component({
  selector: 'app-waper',
  templateUrl: './waper.component.html',
  styleUrls: ['./waper.component.css']
})
export class WaperComponent implements OnInit {

  pages: any[] = [];
  activedPage: any;

  // 模块ID
  remd = 1;
  // 设备
  model: any;
  // 类型
  typeid = 0;

  activedNav: any;

  constructor(
    public dlogService: DlogService,
    public pccService: PccService,
    public wapersService: WapersService,
    public pageHistoryService: PageHistoryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // window.location.href = this.dlogService.host + 'mac/waper.html';
    // return;
    this.model = wapersService.waperModels[0];

    this.activedNav = wapersService.nav[0];

    // 发送消息 页面加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 0,
      tag: 3,
    });

  }

  ngOnInit() {
    // 发送消息 页面数据加载完成 到客户端
    this.pccService.sendClientMessage({
      code: 10,
      tag: 3,
    });

    this.pccService.setChangeDeviceCallback(this.changeDevice.bind(this));
  }

  navigation(nav) {
    this.dlogService.add(nav, 'waper.navigation');
    let ptype: string;
    let pid: string;
    if (nav) {
      ptype = nav.ptype;
      this.remd = nav.remd || this.remd;
      this.model = nav.model || this.model;
      this.typeid = nav.typeid || (this.remd === 4 ? this.typeid : 0);
    }
    if (ptype === 'wapers') {
      pid = JSON.stringify({
        ptype: ptype,
        remd: this.remd,
        typeid: this.typeid || 0,
        model: this.model,
        keyword: nav.keyword || '',
      });
    } else if (ptype === 'classify') {
      pid = JSON.stringify({
        ptype: ptype,
        remd: this.remd,
        typeid: this.typeid || 0,
        model: this.model,
      });
    }
    let page = this.getPage(pid);
    if (!page) {
      if (ptype === 'wapers') {
        page = {
          ptype: ptype,
          pid: pid,
          remd: this.remd,
          model: this.model,
          typeid: this.typeid || 0,
          keyword: nav.keyword || '',
          title: nav.title || '',
          refreshFlag: 0,
        };
      } else if ( ptype === 'classify') {
        page = {
          ptype: ptype,
          pid: pid,
          remd: this.remd,
          model: this.model,
          typeid: this.typeid || 0,
          title: nav.title || '',
          refreshFlag: 0,
        };
      }
      this.pages.push(page);
    }
    this.paging(page);
    this.pageHistoryService.add(this.activedPage);
  }

  classifyNavigation(classify) {
    this.navigation({
      title: classify.name,
      ptype: 'wapers',
      typeid: classify.id,
      model: this.model,
      remd: 4,
    });
  }

  paging($event) {
    this.dlogService.add($event, 'waper.paging');
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
          && nav.typeid === page.typeid
          && (this.activedNav = nav);
      }.bind(this);
      this.wapersService.nav.map(nav => {
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
    this.activedPage.refreshFlag = !this.activedPage.refreshFlag;
    this.dlogService.add(this.activedPage, 'waper.refreshing');
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
    this.dlogService.add($event, 'waper.changeDevice');
    if ($event) {
      const model = this.wapersService.getWperModelForModel($event.model);
      if (model) {
        this.navigation({
          ptype: 'wapers',
          remd: this.activedPage.remd,
          model: model,
          title: this.activedPage.title,
          keyword: this.activedPage.keyword,
        });
      }
    }
    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

  search($event): any {
    this.navigation({
      ptype: 'wapers',
      keyword: $event.keyword
    });
  }

  keywordSuggests($event): any {
    this.wapersService.getKeywordSuggests($event.keyword);
  }

}
