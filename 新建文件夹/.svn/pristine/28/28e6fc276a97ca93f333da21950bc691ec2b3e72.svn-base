import { Component, OnInit, ViewChild } from '@angular/core';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-dlog',
  templateUrl: './dlog.component.html',
  styleUrls: ['./dlog.component.css']
})
export class DlogComponent implements OnInit {

  display = false;

  filterKeyword = '';

  @ViewChild('logTable') logTable;

  constructor(
    public dlogService: DlogService
  ) { }

  ngOnInit() {
  }

  toggle() {
    this.display = !this.display;
  }

  clear() {
    this.dlogService.clear();
  }

  toTop() {
    this.logTable.nativeElement.scrollTop = 0;
  }

  toBottom() {
    this.logTable.nativeElement.scrollTop = this.logTable.nativeElement.scrollHeight;
  }

  filterKeyUp($event): void {
  }

  filter(keyword: string): void {
    this.filterKeyword = keyword;
  }

}
