import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';
import { and } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService) {}

  public createOutputObject(inputWord, dic) {
    let inputTranslation = this.translate(inputWord, dic)
    let output = {
      czechInput : inputWord,
      englishInput : inputTranslation,
      czechParent : '',
      englishParent : '',
      derType : ''
    };
    return output
  }

  public async analyze(inputWord) {
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    let output = this.createOutputObject(inputWord, dic)
    console.log (output)
    let englishParent = ''
    let czechParent = ''
    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let prevItem
    let item = _.find(itemsList, ["word", inputWord])
    if (!(item)) {
      return ['Slovo neexistuje.']
    }
    item = this.searchParent(item, prevItem, itemsList)
    console.log(item)
    czechParent = item.word.replace(/['"]+/g, '');
    englishParent = (this.translate(czechParent, dic))
    return [czechParent, englishParent]
  }

  public searchParent(item, prevItem, itemsList) {
    while(item.parent != "") {
      prevItem = item
      item = _.find(itemsList, ["id", item.parent]);
      if (this.ifPrefix(prevItem, item)) {
        item = prevItem
        break
      }
    }
    return item
  }

  public ifPrefix(prevItem, item) {
    if (prevItem.word.length != item.word.length &&
        prevItem.category == 'V' &&
        item.category == 'V') {
          return true
      }
    else {
      return false
    }
  }

  public translate(word, dic) {
    let translation = 'The translation does not exist.';
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
