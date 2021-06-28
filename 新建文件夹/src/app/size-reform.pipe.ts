import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeReform'
})
export class SizeReformPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let index = 0;
    const srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    const size = srcsize / Math.pow(1024, index);
    return size.toFixed(2) + unitArr[index];
  }

}
