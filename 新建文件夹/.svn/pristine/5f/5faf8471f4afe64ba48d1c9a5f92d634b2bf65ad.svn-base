import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, HostListener } from '@angular/core';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() id: string;

  @Input() options: any[];

  @Input() selected: any;

  @Input() label: string;

  @Input() small: boolean;

  @Input() position: boolean[] = [ false, true, true, false];
  @Input() multiple = false;

  @Output() select: EventEmitter<any> = new EventEmitter();

  display = false;
  changeDisplayTime = 0;
  hideTimer: any;

  constructor(
    public dlogService: DlogService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  @HostListener('window:click', ['$event'])
  onClick($event) {
    // 点击自动关闭 自动关闭在上次变化后100毫秒内才生效 避免事件交叉
    if (Date.now() - this.changeDisplayTime > 100 && this.display) {
      this.hideTimer = setTimeout(() => {
        this.display = false;
      }, 200);
    }
  }

  ngOnInit() {
  }

  toggle(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.changeDisplayTime = Date.now();
    this.display = !this.display;
    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

  change($event): void {
    this.display = false;
    this.select.emit($event);
    // 手动检查更新
    this.changeDetectorRef.detectChanges();
  }

}
