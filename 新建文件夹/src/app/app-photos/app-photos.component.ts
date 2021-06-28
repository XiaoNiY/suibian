import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-app-photos',
  templateUrl: './app-photos.component.html',
  styleUrls: ['./app-photos.component.css']
})
export class AppPhotosComponent implements OnInit {

  @Input() iPhonePhotos;
  @Input() iPadPhotos;

  @Input() model = 'iPhone';

  mouseing = 0;

  @ViewChild('photosBox') photosBox;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:mouseup', ['$event'])
  onmouseup($event) {
    this.mouseing = 0;
  }

  onMousedown($event): void {
    this.mouseing = $event.clientX;
    $event.preventDefault();
    $event.stopPropagation();
  }

  onMousemove($event): void {
    if (this.mouseing) {
      this.photosBox.nativeElement.scrollLeft -= $event.clientX - this.mouseing;
      this.mouseing = $event.clientX;
    }
  }

  viewImage(model: string): void {
    this.model = model;
  }

}
