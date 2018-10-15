import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService) {}

  public word = '';
  public output = '';

  public async analyze(inputWord) {
    let translate = ''
    let parentWord = ''
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    let items = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(items, ["word", inputWord])
    if (!(item)) {
      return ['Slovo neexistuje.']
    }
    while(item.parent != "") {
      item = _.find(items, ["id", item.parent]);
    }
    parentWord = item.word.replace(/['"]+/g, '');
    translate = (await this.translate(parentWord))
    return [parentWord, translate]
  }

  public async translate(outputWord) {
    let translation = '';
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    var arrayDicLength = dic.length;
    for (var i = 0; i < arrayDicLength; i++) {
      let dicLine = dic[i].split("\t")
      var arrayLineLength = dicLine.length;
      for (var j = 0; j < arrayLineLength; j++) {
        if (outputWord == dicLine[j]) {
          return dicLine[0]
        } 
      }
    }
  }
  

  public convertLineToObject(line: string) {
    let columns = line.split("\t");
    return {
      id: columns[0],
      word: columns[1],
      description: columns[2],
      category: columns[3],
      parent: columns[4]
    }

  }
}
