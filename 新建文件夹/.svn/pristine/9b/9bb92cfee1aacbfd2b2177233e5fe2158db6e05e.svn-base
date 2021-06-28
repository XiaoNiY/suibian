import { Component, OnInit, Input } from '@angular/core';
import { AppsService } from '../apps.service';
import { DlogService } from '../dlog.service';
import { HttpParams } from '@angular/common/http';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-app-report',
  templateUrl: './app-report.component.html',
  styleUrls: ['./app-report.component.css']
})
export class AppReportComponent implements OnInit {

  type = 0;
  content = '';
  contact = '';
  attachments = [];

  submiting = false;

  constructor(
    public appsService: AppsService,
    public dlogService: DlogService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
  }


  close(): void {
    this.appsService.reportApp = null;
  }

  reset(): void {
    this.type = 0;
    this.content = '';
    this.contact = '';
    this.attachments = [];
  }

  addAttachments(event): void {
    const files = event.srcElement.files; // 获取图片这里只操作一张图片
    const that = this;
    if (this.attachments.length + files.length > 10) {
      this.messageService.add('文件总数量[' + (this.attachments.length + files.length) + ']超过限制', 5);
    }
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      try {
        if (file) {
          // 限制文件大小
          const errorMsgs = [];
          if (file.size > 512000) {
            errorMsgs.push(' 文件大小超过500KB');
          }
          // 限制文件类型
          if (!(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
            errorMsgs.push(' [' + (file.type || '未知格式') + '] 不支持的文件类型');
          }
          if (errorMsgs.length > 0) {
            throw new Error (file.name + ' 错误：' + errorMsgs.join(';'));
          }
          const fileReader = new FileReader();
          fileReader.onload = function() {
            const attachment = {
              src: this.result,
              image: null,
              y: 0
            };
            const image = new Image();
            image.onload = () => {
              attachment.image = image;
              // 确定图片位置
              if (image.width > 98) {
                if (image.width > image.height) {
                  attachment.y = (98 - 98 / image.width * image.height) / 2;
                }
              } else {
                attachment.y = (98 - Math.min(image.height, 98)) / 2;
              }
              that.dlogService.add([file.name, image.width, image.height], 'attachment.image.onload');
            };
            image.src = this.result;
            that.attachments.push(attachment);
          }.bind(fileReader);
          fileReader.readAsDataURL(file);
        }
      } catch (e) {
        this.messageService.add(e, 5);
        this.dlogService.add(e.message, 'addAttachments.error');
      }
    }
  }

  removeAttachment(attaIndex): void {
    this.attachments.splice(attaIndex, 1);
  }

  submit(): void {
    if (this.submiting) {
      return;
    }
    try {
      this.submiting = true;
      if (!this.type) {
        throw new Error('请选择有害信息类型');
      }
      if (!this.content) {
        throw new Error('请输入举报内容');
      }
      if (this.content.length > 200) {
        throw new Error('举报内容超长');
      }
      if (!this.contact) {
        throw new Error('请输入联系方式');
      }
      if (!/\d{5,20}/.test(this.contact) && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.contact)) {
        throw new Error('请提供你的 电话、QQ、邮箱 其中一种联系方式');
      }
      if (this.attachments.length > 10) {
        throw new Error('文件总数量[' + this.attachments.length + ']超过限制');
      }
      let params = new HttpParams()
        .set('appId', this.appsService.reportApp.AppId)
        .set('appName', this.appsService.reportApp.AppName)
        .set('contentType', this.type + '')
        .set('content', this.content)
        .set('contact', this.contact);
      for (let i = 0; i < this.attachments.length; ++i) {
        params = params.append('attachments', this.attachments[i].src);
      }
      this.appsService.report(params).subscribe(res => {
        this.dlogService.add(res, 'report.res');
        if (!res.code) {
          this.messageService.add('提交成功', 2);
          this.close();
          this.reset();
        } else {
          this.messageService.add('提交失败', 5);
        }
        this.submiting = false;
      }, error => {
        this.dlogService.add(error, 'report.error');
        this.messageService.add('提交失败：' + error.message, 5);
        this.submiting = false;
      });
    } catch (e) {
      this.messageService.add(e.message, 5);
      this.submiting = false;
    }
  }
}
