import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { PageHistoryService } from '../page-history.service';

@Component({
  selector: 'app-page-controller',
  templateUrl: './page-controller.component.html',
  styleUrls: ['./page-controller.component.css']
})
export class PageControllerComponent implements OnInit {

  @Output() paging: EventEmitter<any> = new EventEmitter();
  @Output() refreshing: EventEmitter<any> = new EventEmitter();

  constructor(
    public pageHistoryService: PageHistoryService
  ) { }

  ngOnInit() {
  }

  @HostListener('window:mousedown', ['$event'])
  onContextmenu($event) {
    // 鼠标多功能键
    if ($event.button === 3 || $event.button === 4) {
      // 后退
      if ($event.button === 3) {
        this.back();
      }
      // 前进
      if ($event.button === 4) {
        this.forward();
      }
      $event.preventDefault();
      $event.stopPropagation();
      $event.returnValue = false;
      return false;
    }
  }


  // 历史记录 后退
  back(): void {
    this.pageHistoryService.back();
    this.paging.emit(this.pageHistoryService.pages[this.pageHistoryService.index]);
  }

  // 历史记录 前进
  forward(): void {
    this.pageHistoryService.forward();
    this.paging.emit(this.pageHistoryService.pages[this.pageHistoryService.index]);
  }

  // 刷新当前页面
  refresh(): void {
    this.refreshing.emit('');
  }

}
