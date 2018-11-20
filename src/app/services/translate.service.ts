import { Injectable } from '@angular/core';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private load: LoadFileService) {}


  public async toEng(word) {
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let translation = this.translate(word, dic)
    if (translation.match(/^\w+\s+\w+$/)) {
      let words = translation.split(' ')
      words[0] = words[0] + 's'
      translation = words.join(' ')
    }
    return translation
  }


  public translate(word, dic) {
    let translation = '';
    var arrayDicLength = dic.length;
    for (var i = 0; i < arrayDicLength; i++) {
      let dicLine = dic[i].split("\t")
      var arrayLineLength = dicLine.length;
      for (var j = 0; j < arrayLineLength; j++) {
        if (word == dicLine[j]) {
          translation = dicLine[0]
          return translation
        } 
      }
    }
    return translation
  }
}
