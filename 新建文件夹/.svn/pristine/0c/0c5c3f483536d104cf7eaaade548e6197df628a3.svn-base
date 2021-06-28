import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-btn-totop',
  templateUrl: './btn-totop.component.html',
  styleUrls: ['./btn-totop.component.css']
})
export class BtnTotopComponent implements OnInit {

  @Input() pcec: String;

  constructor() { }

  ngOnInit() {
  }

  totop(e): void {
    for (let i = 0; i < e.path.length; ++i) {
      if (e.path[i].classList && e.path[i].classList.contains(this.pcec)) {
        e.path[i].scrollTop = 0;
        break;
      }
    }
  }

}
