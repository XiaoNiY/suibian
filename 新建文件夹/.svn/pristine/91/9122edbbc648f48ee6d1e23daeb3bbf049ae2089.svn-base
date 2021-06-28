import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationReform',
  pure: true
})
export class DurationReformPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const m = Math.floor(value / 60),
      s = value % 60;
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    return null;
  }

}
