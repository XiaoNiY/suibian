import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageHistoryService {
  pages: any[] = [];
  index = -1;

  constructor() { }

  add(page: any) {
    if (this.index + 1 !== this.pages.length) {
      this.pages.splice(this.index + 1);
    }
    this.pages[++this.index] = page;
  }

  back() {
    if (this.index > 0) {
      --this.index;
    }
  }

  forward() {
    if (this.index + 1 < this.pages.length) {
      ++this.index;
    }
  }

  clear() {
    this.pages = [];
  }
}
