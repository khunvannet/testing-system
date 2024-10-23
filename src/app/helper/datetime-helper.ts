import {DatePipe} from '@angular/common';

export class DatetimeHelper {
  static toShortDateString(value: Date): string {
    return <string>new DatePipe('en-US').transform(value, 'yyyy-MM-dd');
  }
}
