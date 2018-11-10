import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService, private translator: TranslateService) {}

  public infoBase = {
    czechInput : '',
    englishInput : '',
    czechParent : '',
    englishParent : '',
    derivType : '',
    isPrefig : Boolean(),
    prefix : ''
  };


  public prefixes = ['do','na','nad','o','ob','od','po','pod','pro','pře','před','při','s','z','u','v','z','za','roz','vy','vz']


  public async initInfoBase(inputWord) {
    this.infoBase.czechInput = inputWord
    this.infoBase.englishInput = await this.translator.toEng(inputWord)
    this.infoBase.isPrefig = false
    this.infoBase.prefix = ''
  }

  
  public async analyze(inputWord) {
    let tsvContent = (await this.load.loadFile('derinet-1-5-1.tsv')).split("\n");
    await this.initInfoBase(inputWord)

    console.log('LOADING ...')
    let itemsList = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(itemsList, ["word", inputWord])
    if (item === undefined) {
      return 'Wrong input.'
    }
  
    this.infoBase.czechParent = await this.searchParent(item, itemsList)
    this.infoBase.englishParent = await this.translator.toEng(this.infoBase.czechParent)

    console.log(this.infoBase)
    return this.infoBase
  }


  public async searchParent(item, itemsList) {
    let derivationPath = []
    derivationPath.push(item)
    let prevItem = ''
    while(item.parent != "") {
      if (this.infoBase.englishInput == '') {
        this.infoBase.englishInput = await this.translator.toEng(item.word)
      }
      prevItem = item
      item = _.find(itemsList, ["id", item.parent]);
      derivationPath.push(item)

      if (this.PartOfSpeechChange(item, prevItem)) {
        this.infoBase.derivType = await this.checkDertivationType(item, prevItem)
      }
      if (this.ifPrefix(item, prevItem)) {
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
    let prefix = this.getPrefix(prevItem)
    if (
      prefix &&
      prefix != item.word.substring(0,prefix.length) &&
      prevItem.category == 'V' &&
      item.category == 'V'
    ) {
      this.infoBase.prefix = prefix
      return true
    } else {
      return false
    }
  }


  public getPrefix(prevItem) {
    let prefix
    _.forEach(this.prefixes, (value) => {
      if (prevItem.word.startsWith(value)) {
        prefix = value
      }
    })
    return prefix
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
