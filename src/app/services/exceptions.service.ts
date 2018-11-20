import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {

  constructor() { }


  public findExcept(verb, derivtype, exceptions) {
    let exception = false
    _.forEach(exceptions[derivtype], (value, key) => {
      if (verb === key) {
        exception = value
        return false
      }
    })
    return exception
  }


  public isExcept(verb, derivtype, exceptions) {
    let isExcept = false
    _.forEach(exceptions[derivtype], (value, key) => {
      if (verb === key) {
        isExcept = true
        return false
      }
    })
    return isExcept
  }
}
