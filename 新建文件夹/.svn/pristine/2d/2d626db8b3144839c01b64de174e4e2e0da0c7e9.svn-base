import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-status',
  templateUrl: './data-status.component.html',
  styleUrls: ['./data-status.component.css']
})
export class DataStatusComponent implements OnInit {

  @Input() status = 'none';

  @Output() retryEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  doRetry($event) {
    this.retryEvent.emit(null);
  }
}
