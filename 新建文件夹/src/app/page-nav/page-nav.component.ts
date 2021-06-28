import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { PccService } from '../pcc.service';

@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
  styleUrls: ['./page-nav.component.css']
})
export class PageNavComponent implements OnInit {
  @ViewChild('navScroll') navScroll: ElementRef;
  @Input() navData = [];
  @Input() activedNav: any;
  @Output() navigation: EventEmitter<any> = new EventEmitter();
  @Output() changeDevice: EventEmitter<any> = new EventEmitter();

  constructor(
    public pccService: PccService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 取第一个导航为默认
    if (this.navData[0].children && this.navData[0].children.length > 0) {
      this.onActive(this.navData[0].children[0]);
    } else {
      this.onActive(this.navData[0]);
    }
  }

  onActive(nav: any) {
    if (nav.children && nav.children.length > 0) {
      // nav.open = !nav.open;
      let isChildren = false;
      for (let i = 0; i < nav.children.length; ++i) {
        if (nav.children[i] === this.activedNav) {
          isChildren = true;
          break;
        }
      }
      if (!isChildren) {
        this.navigation.emit(nav.children[0]);
      }
    } else {
      this.navigation.emit(nav);
    }
    this.toScroll();
  }

  /**
   * 点击最后一个item 自动推上一个
   */
  toScroll() {
    //总高度
    let scrollH = this.navScroll.nativeElement.scrollHeight;
    //已滚TOP
    let scrollT = this.navScroll.nativeElement.scrollTop;
    //可见高度+已滚top=是否滚动到底部
    let scrollS = this.navScroll.nativeElement.clientHeight + scrollT;

    let e: any = window.event;

    //底部不滚动 || 判断是否点击最后一个
    if (scrollS == scrollH || (e.pageY - 45) <= (this.navScroll.nativeElement.clientHeight - 36)) return;
    //已滚动top + 已知item高度 = 滚到下一个item 这个没动画效果
    //this.navScroll.nativeElement.scrollTo(0,scrollT+36,6000);
    this.scrollAnimation(scrollT, scrollT + 36);

  }
  /**
   * 滚动动画
   * 
   * @param currentY 当前滚动位置
   * @param targetY 滚动位置
   */
  scrollAnimation(currentY, targetY) {
    // 计算需要移动的距离
    let needScrollTop = targetY - currentY
    let _currentY = currentY
    setTimeout(() => {
      // 一次调用滑动帧数，每次调用会不一样
      const dist = Math.ceil(needScrollTop / 10)
      _currentY += dist
      this.navScroll.nativeElement.scrollTo(_currentY, currentY)
      // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
      if (needScrollTop > 10 || needScrollTop < -10) {
        this.scrollAnimation(_currentY, targetY)
      } else {
        this.navScroll.nativeElement.scrollTo(_currentY, targetY)
      }
    }, 1)
  }
  selectDevice($event): void {
    this.pccService.changeDevice($event);
    this.changeDevice.emit($event);
    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

}
