import { Pipe, PipeTransform } from '@angular/core';
import { Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'html'
})
export class HtmlPipe implements PipeTransform {

  constructor (private sanitizer: DomSanitizer) {
  }

  transform(content): any {
    return content.replace(/&nbsp;/ig, ' ');
  }

}
