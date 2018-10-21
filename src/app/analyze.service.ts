import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';
import { and } from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService) {}

  public output = {
    czechInput : '',
    englishInput : '',
    czechParent : '',
    englishParent : '',
    derivType : ''
  };


  public async initializateOutput(inputWord, dic) {
    this.output.czechInput = inputWord
    this.output.englishInput = this.translate(inputWord, dic)
  }

  public async analyze(inputWord) {
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    await this.initializateOutput(inputWord, dic)
    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(itemsList, ["word", inputWord])
    let searchResults = []
    let derivationPath = []
    if (!(item)) {
      return 'Slovo neexistuje.'
    }
    derivationPath.push(item)
    searchResults = await this.searchParent(item, itemsList, derivationPath, dic)
    this.output.czechParent = searchResults[0]
    this.output.derivType = searchResults[1]
    this.output.englishParent = (this.translate(this.output.czechParent, dic))
    console.log(this.output)
    return this.output
  }

  public async searchParent(item, itemsList, derivationPath, dic) {
    let prevItem = ''
    let derType = ''
    while(item.parent != "") {
      if (this.output.englishInput == '') {
        this.output.englishInput = this.translate(item.word, dic)
      }
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
    console.log(derivationPath)
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
    return derType
  }

  public ifPrefix(prevItem, item) {
    if (
      prevItem.word.substring(0,3) != item.word.substring(0,3) &&
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
