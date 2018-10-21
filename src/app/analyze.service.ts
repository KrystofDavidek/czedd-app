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
    let derivationPath = []
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    let output = this.createOutputObject(inputWord, dic)
    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(itemsList, ["word", inputWord])
    let searchResults = []
    if (!(item)) {
      return ['Slovo neexistuje.']
    }
    derivationPath.push(item)
    searchResults = this.searchParent(item, itemsList, derivationPath)
    output.czechParent = searchResults[0]
    output.derType = searchResults[1]
    output.englishParent = (this.translate(output.czechParent, dic))
    console.log(output)
    return output
  }

  public searchParent(item, itemsList, derivationPath) {
    let prevItem = ''
    let derType = ''
    while(item.parent != "") {
      prevItem = item
      item = _.find(itemsList, ["id", item.parent]);
      derivationPath.push(item)
      if (this.PartOfSpeechChange(item, prevItem)) {
        derType = this.checkDertivationType(item, prevItem)
      }
      if (this.ifPrefix(prevItem, item)) {
        item = prevItem
        break
      }
    }
    // console.log(derivationPath)
    return [item.word, derType]
  }

  public PartOfSpeechChange(item, prevItem) {
    if (item.category != prevItem.category) {
      return true
    }
    else {
      return false
    }
  }

  public checkDertivationType(item, prevItem) {
    let derType = ''
    if (
      prevItem.category == 'N' && 
      item.category == 'V' &&
      prevItem.word.endsWith("tel")
    ) {
      derType = 'tel'
    }
    else {
      derType = 'spatne'
    }
    return derType
  }

  public ifPrefix(prevItem, item) {
    if (
      prevItem.word.length != item.word.length &&
      prevItem.category == 'V' &&
      item.category == 'V'
    ) {
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
