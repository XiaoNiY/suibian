import { Component, OnInit, Input } from '@angular/core';
import { PccService } from '../pcc.service';
import { DlogService } from '../dlog.service';

@Component({
  selector: 'app-app-download-button',
  templateUrl: './app-download-button.component.html',
  styleUrls: ['./app-download-button.component.css']
})
export class AppDownloadButtonComponent implements OnInit {

  @Input() app;

  constructor(
    public pccService: PccService,
    public dlogService: DlogService
  ) { }

  ngOnInit() {
  }

  download() {
    this.pccService.downloadApp(this.app);
  }

}
