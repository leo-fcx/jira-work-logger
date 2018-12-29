import { Pipe } from '@angular/core';
import { PipeTransform } from './PipeTransform';

@Pipe({ name: 'timespent' })
export class TimeSpentPipe implements PipeTransform {
  transform(milliseconds: any) {

    if (milliseconds === null) {
      return 'Unset.';
    }

    const cd = 24 * 60 * 60,
      ch = 60 * 60;
    let d = Math.floor(milliseconds / cd),
      h = Math.floor((milliseconds - d * cd) / ch),
      m = Math.round((milliseconds - d * cd - h * ch) / 60);

    if (m === 60) {
      h++;
      m = 0;
    }

    if (h === 24) {
      d++;
      h = 0;
    }
    return `${d}d ${h}h ${m}m`;
  }
}
