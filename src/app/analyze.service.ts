import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';
import { and } from '@angular/router/src/utils/collection';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { BooleanValueAccessor } from '@ionic/angular';

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
    derivType : '',
    isPrefig : Boolean()
  };


  public async initializateOutput(inputWord, dic) {
    this.output.czechInput = inputWord
    this.output.englishInput = this.translate(inputWord, dic)
    this.output.isPrefig = false
  }

  
  public async analyze(inputWord) {
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    await this.initializateOutput(inputWord, dic)
    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(itemsList, ["word", inputWord])
    if (item === undefined) {
      return 'Wrong input.'
    }
    this.output.czechParent = await this.searchParent(item, itemsList, dic)
    this.output.englishParent = this.translate(this.output.czechParent, dic)
    console.log(this.output)
    return this.output
  }


  public async searchParent(item, itemsList, dic) {
    let derivationPath = []
    derivationPath.push(item)
    let prevItem = ''
    while(item.parent != "") {
      if (this.output.englishInput == '') {
        this.output.englishInput = this.translate(item.word, dic)
      }
      prevItem = item
      item = _.find(itemsList, ["id", item.parent]);
      derivationPath.push(item)
      if (this.PartOfSpeechChange(item, prevItem)) {
        this.output.derivType = this.checkDertivationType(item, prevItem)
      }
      if (this.ifPrefix(prevItem, item)) {
        item = prevItem
        this.output.isPrefig = true
        break
      }
    }
    console.log(derivationPath)
    return item.word
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
    let derivType = ''
    if (
      prevItem.category == 'N' && 
      item.category == 'V' &&
      prevItem.word.endsWith("tel")
    ) {
      derivType = 'tel'
    }
    return derivType
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
