import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {

  constructor() { }


  public findExcept(verb, derivtype, gender, exceptions) {
    let exception = false;
    if (gender === 'F' && derivtype === 'tel') {
      derivtype += 'ka';
    }
    _.forEach(exceptions[derivtype], (value, key) => {
      if (verb === key) {
        exception = value;
        return false;
      }
    });
    return exception;
  }


  public isExcept(verb, derivtype, gender, exceptions) {
    let isExcept = false;
    if (gender === 'F' && derivtype === 'tel') {
      derivtype += 'ka';
    }
    _.forEach(exceptions[derivtype], (value, key) => {
      if (verb === key) {
        isExcept = true;
        return false;
      }
    });
    return isExcept;
  }
}
