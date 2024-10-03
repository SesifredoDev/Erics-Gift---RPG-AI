import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'home',
  standalone: true
})
export class HomePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
