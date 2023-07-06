import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentPipe',
})
export class MomentPipePipe implements PipeTransform {
  transform(value: Date): any {
    return moment(value).fromNow();
  }
}
