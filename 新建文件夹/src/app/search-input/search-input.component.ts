import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { AppsService } from '../apps.service';
import { RingsService } from '../rings.service';
import { WapersService } from '../wapers.service';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {

  // ID
  @Input() id: string;

  // 提示文字
  @Input() placeholder: string;

  // 关键字
  @Input() keyword: string;

  // 搜索类型选项
  @Input() typeSelect: any;

  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() keywordSuggests: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputEl') inputEl;

  // 搜索关键字提示
  @Input() suggests: any[];
  suggestsTimer: any;

  constructor(
    public dlogService: DlogService,
    public pccService: PccService
  ) { }

  ngOnInit() {
  }

  // 清除输入
  clear(): void {
    this.keyword = '';
    this.inputEl.nativeElement.focus();
  }

  focus($event): void {
    this.dlogService.add($event, 'SearchInput.focus');
  }

  // 输入框失去焦点
  blur($event): void {
    // 200毫秒后再清除提示 以供提示点击事件响应时间
    setTimeout(this.clearSuggests.bind(this), 200);
  }

  // 输入框输入事件
  keyUp($event): void {
    this.clearSuggests();
    if (this.keyword && this.keyword.replace(/(^\s*)|(\s*$)/g, '')) {
      if ($event.keyCode === 13) {
        this.searching();
      } else {
        this.suggestsTimer = setTimeout(this.getSuggests.bind(this), 500);
      }
    }
  }

  // 搜索
  searching($event?: any): void {
    let keyword = $event ? $event.target.innerHTML : this.keyword;
    keyword = keyword.replace(/(^\s*)|(\s*$)/g, '');

    this.dlogService.add(keyword, 'searching');
    this.keyword = keyword;
    if (this.keyword) {
      this.clearSuggests();
      this.search.emit({
        keyword: this.keyword,
        typeSelected: this.typeSelect ? this.typeSelect.selected : null
      });
    }
  }

  // 清除关键字联想
  clearSuggests(): void {
    if (this.suggestsTimer) {
      clearTimeout(this.suggestsTimer);
    }
    this.suggests = null;
  }

  // 获取关键字联想
  getSuggests(): void {
    if (this.keyword && this.keyword.replace(/(^\s*)|(\s*$)/g, '')) {
      this.keywordSuggests.emit({
        keyword: this.keyword,
        typeSelected: this.typeSelect ? this.typeSelect.selected : null
      });
    }
  }

  typeSelectChange($event): void {
    this.typeSelect.selected = $event;
  }
}
