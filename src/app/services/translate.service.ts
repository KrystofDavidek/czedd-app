import { Injectable } from '@angular/core';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private load: LoadFileService) { }


  public async toEng(word) {
    const mainVerb = { id: 0, verb: '' };
    const dic = (await this.load.loadFile('slovnik.csv')).split('\n');
    let translation = this.translate(word, dic);
    if (translation.match(/^\w+\s+\w+(\s+\w+)?$/)) {
      const words = translation.split(' ');
      if (words[0] === 'to') {
        words.splice(0, 1);
      }
      if (words.length > 2) {
        let i = 0;
        // tslint:disable-next-line:no-shadowed-variable
        for (const word of words) {
          i = i + 1;
          if (word.length > mainVerb.verb.length) {
            mainVerb.id = i;
          }
        }
      }
      if (words[mainVerb.id].endsWith('s') || words[mainVerb.id].endsWith('ch')) {
        words[mainVerb.id] = words[mainVerb.id] + 'es';
      } else {
        words[mainVerb.id] = words[mainVerb.id] + 's';
      }
      console.log(words);
      translation = words.join(' ');
    }
    return translation;
  }


  public translate(word, dic) {
    let translation = '';
    const arrayDicLength = dic.length;
    for (let i = 0; i < arrayDicLength; i++) {
      const dicLine = dic[i].split('\t');
      const arrayLineLength = dicLine.length;
      for (let j = 0; j < arrayLineLength; j++) {
        if (word === dicLine[j]) {
          translation = dicLine[1];
          return translation;
        }
      }
    }
    return translation;
  }
}
