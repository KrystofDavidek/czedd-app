import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {

  constructor() { }

  public exceptions = {
    'chovat': 'chová',
    'kovat': 'ková',
    'klovat': 'klová/klove',
    'snovat': 'snová/snove',
    'plovat': 'plová/plové'
  }


  public findExcept(verb) {
    let except
    _.forEach(this.exceptions, function(value, key) {
      if (verb === key) {
        except = value
      }
    })
    return except
  }


  public isExcept(verb) {
    let isExcept = false
    _.forEach(this.exceptions, function(value, key) {
      if (verb === key) {
        isExcept = true
      }
    })
    return isExcept
  }
}
