import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { PageHistoryService } from '../page-history.service';
import { AppsService } from '../apps.service';
import { Observable, of, fromEvent } from 'rxjs';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
    selector: 'app-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {

    navData: any[] = [
        { title: '精选', icon: 'jingxuan', ptype: 'apps', sort: 0, remd: 1 },
        {
            title: '应用', icon: 'apps', open: true, children: [
                { title: '应用推荐', ptype: 'apps', sort: 1, remd: 3 },
                { title: '流行应用', ptype: 'apps', sort: 1, remd: 44 },
                { title: '应用专题', ptype: 'special', sort: 1 },
            ]
        },
        {
            title: '游戏', icon: 'game', open: true, children: [
                { title: '游戏推荐', ptype: 'apps', sort: 2, remd: 3 },
                { title: '流行游戏', ptype: 'apps', sort: 2, remd: 44 },
                { title: '游戏专题', ptype: 'special', sort: 2 },
            ]
        },
    ];
    activedNav = this.navData[0];

    pages: any[] = [];
    activedPage: any;
    selectedApp: any;

    model = 'iPhone';
    sort = 0;
    remd = 1;
    appType: any;
    gameType: any;
    auth = 1;
    hd = 1;
    ts = 1;

    constructor(
        public dlogService: DlogService,
        public pccService: PccService,
        public appsService: AppsService,
        public pageHistoryService: PageHistoryService
    ) {
        // 发送消息 页面加载完成 到客户端
        this.pccService.sendClientMessage({
            code: 0,
            tag: 1,
        });
    }

    ngOnInit() {
        this.pccService.sendClientMessage({
            code: 11,
            tag: 1,
        });

        // 发送消息 获取本地、设备资源列表 到客户端
        this.pccService.sendClientMessage({
            code: 10,
            tag: 1,
        });

        this.appType = this.appsService.appTypes[1][0];
        this.gameType = this.appsService.appTypes[2][0];
    }

    navigation(nav) {
        this.dlogService.add(nav, 'apps.navigation');
        let ptype: string;
        let pid: string;
        if (nav) {
            this.model = nav.model || this.model;
            this.sort = typeof nav.sort !== 'undefined' ? nav.sort : this.sort;
            if (this.sort === 1) {
                if (nav.appType) {
                    this.appType = nav.appType;
                }
                if (this.appType.value) {
                    if (nav.remd === 3) {
                        this.remd = 6;
                    } else if (nav.remd === 44) {
                        this.remd = 74;
                    } else {
                        this.remd = nav.remd;
                    }
                } else {
                    if (nav.remd === 6) {
                        this.remd = 3;
                    } else if (nav.remd === 74) {
                        this.remd = 44;
                    } else {
                        this.remd = nav.remd;
                    }
                }
            } else if (this.sort === 2) {
                if (nav.appType) {
                    this.gameType = nav.appType;
                }
                if (this.gameType.value) {
                    if (nav.remd === 3) {
                        this.remd = 6;
                    } else if (nav.remd === 44) {
                        this.remd = 74;
                    } else {
                        this.remd = nav.remd;
                    }
                } else {
                    if (nav.remd === 6) {
                        this.remd = 3;
                    } else if (nav.remd === 74) {
                        this.remd = 44;
                    } else {
                        this.remd = nav.remd;
                    }
                }
            } else {
                this.remd = nav.remd || this.remd;
            }
            this.auth = typeof nav.auth !== 'undefined' ? nav.auth : this.auth;
            this.hd = typeof nav.hd !== 'undefined' ? nav.hd : this.hd;
            this.ts = typeof nav.ts !== 'undefined' ? nav.ts : this.ts;
            ptype = nav.ptype;
        }
        if (ptype === 'apps') {
            pid = JSON.stringify({
                ptype: ptype,
                model: this.model,
                jail: this.pccService.getJail(),
                sort: this.sort,
                auth: this.auth,
                appType: this.sort === 0 ? this.appsService.appTypes[1][0] : (this.sort === 1 ? this.appType : this.gameType),
                remd: this.remd,
                specialid: nav.specialid || 0,
                keyword: nav.keyword || '',
                hd: this.hd,
                ts: this.ts,
            });
        } else if (ptype === 'special') {
            pid = JSON.stringify({
                ptype: ptype,
                model: this.model,
                jail: this.pccService.getJail(),
                sort: this.sort,
            });
        } else if (ptype === 'detail') {
            pid = JSON.stringify({
                ptype: ptype,
                id: nav.detailParams.id,
                from: nav.detailParams.from,
                pkagetype: nav.detailParams.pkagetype,
                model: this.model,
                ts: this.ts,
            });
        }
        let page = this.getPage(pid);
        if (!page) {
            if (ptype === 'apps') {
                page = {
                    ptype: ptype,
                    pid: pid,
                    model: this.model,
                    jail: this.pccService.getJail(),
                    auth: this.auth,
                    sort: this.sort,
                    appType: this.sort === 0 ? this.appsService.appTypes[1][0] : (this.sort === 1 ? this.appType : this.gameType),
                    remd: this.remd,
                    specialid: nav.specialid || 0,
                    specialimage: nav.specialimage || '',
                    keyword: nav.keyword || '',
                    hd: this.hd,
                    ts: this.ts,
                    title: nav.title || '',
                    refreshFlag: 0,
                };
            } else if (ptype === 'special') {
                page = {
                    ptype: ptype,
                    pid: pid,
                    model: this.model,
                    jail: this.pccService.getJail(),
                    sort: this.sort,
                    title: this.sort === 1 ? '应用专题' : '游戏专题',
                    refreshFlag: 0,
                };
            } else if (ptype === 'detail') {
                page = {
                    ptype: ptype,
                    pid: pid,
                    id: nav.detailParams.id,
                    from: nav.detailParams.from,
                    pkagetype: nav.detailParams.pkagetype,
                    model: this.model,
                    ts: this.ts,
                    refreshFlag: 0,
                };
            }
            this.pages.push(page);
        }
        this.paging(page);
        this.pageHistoryService.add(this.activedPage.pid);
    }

    paging($event) {
        this.dlogService.add($event, 'apps.paging');
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
            const ddnav = function (nav) {
                if (nav.ptype !== page.ptype) {
                    return false;
                }
                // 修正导航
                let tremd = nav.remd;
                if (nav.ptype === 'apps' && (nav.sort === 1 || nav.sort === 2)) {
                    if (nav.sort && page.appType.value) {
                        if (nav.remd === 3) {
                            tremd = 6;
                        } else if (nav.remd === 44) {
                            tremd = 74;
                        }
                    }
                }
                return page.sort === nav.sort && page.remd === tremd && (this.activedNav = nav);
            }.bind(this);
            this.navData.map(nav => {
                if (nav.children && nav.children.length > 0) {
                    nav.children.map(cnav => ddnav(cnav));
                } else {
                    ddnav(nav);
                }
            });

            // 同步model
            this.model = page.model;
        }
    }

    // 刷新页面
    refreshing($event): void {
        this.activedPage.refreshFlag = !this.activedPage.refreshFlag;
        this.dlogService.add(this.activedPage, 'apps.refreshing');
    }

    getPage(pid: string): any {
        for (let i = 0; i < this.pages.length; ++i) {
            if (this.pages[i].pid === pid) {
                return this.pages[i];
            }
        }
        return null;
    }

    selectModel(model: string): void {
        const nav = Object.assign({}, this.navData[0]);
        nav.model = model;
        this.navigation(nav);
    }

    changeDevice($event): void {
        this.dlogService.add($event, 'apps.changeDevice');
    }

    search($event): any {
        this.navigation({
            ptype: 'apps',
            keyword: $event.keyword,
        });
    }

    keywordSuggests($event): any {
        this.appsService.getKeywordSuggests($event.keyword);
    }
}
