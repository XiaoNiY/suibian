import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  @Input() message = '发生错误';
  @Input() icon = './assets/error.png';
  @Input() retry = false;

  @Output() retryEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  doRetry($event) {
    this.retryEvent.emit(null);
  }

}
