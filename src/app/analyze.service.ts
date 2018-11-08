import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService) {}

  public infoBase = {
    czechInput : '',
    englishInput : '',
    czechParent : '',
    englishParent : '',
    derivType : '',
    isPrefig : Boolean()
  };


  public prefixes = ['do','na','nad','o','ob','od','po','pod','pro','pře','před','při','s','z','u','v','z','za','roz','vy','vz']


  public async initInfoBase(inputWord, dic) {
    this.infoBase.czechInput = inputWord
    this.infoBase.englishInput = this.translate(inputWord, dic)
    this.infoBase.isPrefig = false
  }

  
  public async analyze(inputWord) {
    let dic = (await this.load.loadFile('en-cs.txt')).split("\n");
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    await this.initInfoBase(inputWord, dic)

    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(itemsList, ["word", inputWord])
    if (item === undefined) {
      return 'Wrong input.'
    }
    this.infoBase.czechParent = await this.searchParent(item, itemsList, dic)
    this.infoBase.englishParent = this.translate(this.infoBase.czechParent, dic)

    console.log(this.infoBase)
    return this.infoBase
  }


  public async searchParent(item, itemsList, dic) {
    let derivationPath = []
    derivationPath.push(item)
    let prevItem = ''
    
    while(item.parent != "") {
      if (this.infoBase.englishInput == '') {
        this.infoBase.englishInput = this.translate(item.word, dic)
      }
      prevItem = item
      item = _.find(itemsList, ["id", item.parent]);
      derivationPath.push(item)

      if (this.PartOfSpeechChange(item, prevItem)) {
        this.infoBase.derivType = await this.checkDertivationType(item, prevItem)
      }
      if (this.ifPrefix(prevItem, item)) {
        item = prevItem
        this.infoBase.isPrefig = true
        break
      }
      if (this.stemmChange(item, prevItem)) {
        item = prevItem
        break
      }
    }
    console.log(derivationPath)
    return item.word
  }


  public stemmChange(item, prevItem) {
    if (
      item.word.substring(2,item.word.length - 2) != prevItem.word.substring(2,item.word.length - 2) &&
      prevItem.category == 'V' &&
      item.category == 'V'
    ) {
      return true
    } else {
      return false
    }
  }


  public PartOfSpeechChange(item, prevItem) {
    if (item.category != prevItem.category) {
      return true
    } else {
      return false
    }
  }


  public async checkDertivationType(item, prevItem) {
    let rules = (await this.load.loadJson('derivTypes.json'))
    let resultDerivType  = ''
    _.forEach(rules[prevItem.category][item.category],(affix, derivType) => {
      if (affix.startsWith('-') && prevItem.word.endsWith(affix.substring(1))) {
        resultDerivType = derivType
      }
    })
    return resultDerivType
  }


  public ifPrefix(item, prevItem) {
    if (
      prevItem.word.substring(0,3) != item.word.substring(0,3) &&
      prevItem.category == 'V' &&
      item.category == 'V'
    ) {
      return true
    } else {
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
