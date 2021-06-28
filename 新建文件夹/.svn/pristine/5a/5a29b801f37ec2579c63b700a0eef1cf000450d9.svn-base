import { Component, OnInit, Input } from '@angular/core';
import { AppsService } from '../apps.service';
import { DlogService } from '../dlog.service';
import { MessageService } from '../message.service';
import { HttpParams } from '@angular/common/http';
import { PccService } from '../pcc.service';

@Component({
  selector: 'app-clarence',
  templateUrl: './app-clarence.html',
  styleUrls: ['./app-clarence.css']
})
export class ClarenceComponent implements OnInit {

  content = '';
  submiting = false;

  constructor(
    public appsService: AppsService,
    public dlogService: DlogService,
    public pccService: PccService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }
  close() {
    this.content = "";
    this.appsService.clarenceApp = null;
  }

  submit(): void {
    if (this.submiting) {
      return;
    }
    try {
      this.submiting = true;
      if (!this.content) {
        throw new Error('请输入许愿内容');
      }
      if (this.content.length > 200) {
        throw new Error('许愿内容超长');
      }
      let params = new HttpParams()
        .set('model', this.pccService.model)
        .set('osversion', this.pccService.osversion)
        .set('appid', this.pccService.appid + '')
        .set('info', this.content);

      this.appsService.clarence(params).subscribe(res => {
        this.dlogService.add(res, 'report.res');
        if (!res.code) {
          this.messageService.add('提交成功', 2);
          this.close();
        } else {
          this.messageService.add('提交失败', 5);
        }
        this.submiting = false;
        this.content = "";
      }, error => {
        if (error.statusText == "JSONP Error") {
          this.close();
          this.messageService.add('提交成功', 2);
        } else {
          this.dlogService.add(error, 'report.error');
          this.messageService.add('提交失败：' + error.message, 5);
        }

        this.content = "";
        this.submiting = false;
      });
    } catch (e) {
      this.messageService.add(e.message, 5);
      this.submiting = false;
    }
  }

}
