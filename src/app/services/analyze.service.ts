import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService, private translator: TranslateService) { }

  public inputWordFromIndex = '';

  public infoBase = {
    czechInput: '',
    englishInput: '',
    czechParent: '',
    englishParent: '',
    derivType: '',
    isPrefig: Boolean(),
    prefix: '',
    derProcess: '',
    gender: '',
    derivationPath: []
  };


  public prefixes = ['do', 'na', 'nad', 'o', 'ob', 'od', 'po', 'pod', 'pro',
    'pře', 'před', 'při', 's', 'z', 'u', 'v', 'z', 'za', 'roz', 'vy', 'vz'];


  public alternations = {
    'u': 'ou'
  };


  public async initInfoBase(inputWord) {
    this.infoBase.czechInput = inputWord;
    this.infoBase.englishInput = await this.translator.toEng(inputWord);
    this.infoBase.derivType = '';
    this.infoBase.isPrefig = false;
    this.infoBase.prefix = '';
    this.infoBase.derProcess = '';
    this.infoBase.gender = '';
    this.infoBase.derivationPath = [];
  }


  public async analyze(inputWord) {
    const tsvContent = (await this.load.loadFile('telka_beta.tsv')).split('\n');
    await this.initInfoBase(inputWord);
    console.log('LOADING ...');
    const itemsList = _.map(tsvContent, this.convertLineToObject);
    const item = _.find(itemsList, ['word', inputWord]);
    if (item === undefined) {
      return 'Wrong input.';
    }

    this.infoBase.czechParent = await this.searchParent(item, itemsList);
    this.infoBase.englishParent = await this.translator.toEng(this.infoBase.czechParent);

    console.log(this.infoBase);
    return this.infoBase;
  }


  public async searchParent(item, itemsList) {
    let derivationPath = [];
    derivationPath.push(item);
    let prevItem;
    while (item.parent !== undefined && item.parent !== '') {
      if (this.infoBase.englishInput === '') {
        this.infoBase.englishInput = await this.translator.toEng(item.word);
      }
      prevItem = item;
      item = _.find(itemsList, ['id', item.parent]);
      derivationPath.push(item);

      if (this.PartOfSpeechChange(item, prevItem)) {
        if (!this.infoBase.derivType) {
          await this.checkDertivationType(item, prevItem);
          this.ifPrefixToRoot(prevItem, itemsList);
          derivationPath = _.concat(derivationPath, this.findAnotherParents(item, itemsList));
          break;
        }
      }
      /* if (this.ifPrefix(item, prevItem)) {
        item = prevItem;
        break;
      }
      if (this.stemmChange(item, prevItem)) {
        item = prevItem;
        this.ifPrefixToRoot(prevItem, itemsList);
        break;
      } */
    }
    console.log(derivationPath);
    this.infoBase.derivationPath = derivationPath;
    return item.word;
  }


  public findAnotherParents(item, itemsList) {
    let parent = item;
    const derivationPath = [];
    let anotherParent = _.find(itemsList, ['id', parent.parent]);
    while (anotherParent && parent.category !== undefined && parent.parent !== undefined && parent.category === anotherParent.category) {
      console.log([parent, anotherParent]);
      if (this.ifPrefix(anotherParent, parent)) {
        break;
      }
      derivationPath.push(anotherParent);
      parent = anotherParent;
      anotherParent = _.find(itemsList, ['id', parent.parent]);
    }
    return derivationPath;
  }


  public stemmChange(item, prevItem) {
    if (
      item.word !== prevItem.word &&
      prevItem.category === 'V' && item.category === 'V'
    ) {
      return true;
    } else {
      return false;
    }
    /* if (
      item.word.substring(0, item.word.length - 1) !== prevItem.word.substring(0, item.word.length - 1) &&
      prevItem.category === 'V' && item.category === 'V' &&
      (!this.ifAlternation(item, prevItem))
    ) {
      return true;
    } else {
      return false;
    } */
  }


  public ifAlternation(item, prevItem) {
    let ifAlternation = false;
    _.forIn(this.alternations, (value, key) => {
      if (_.includes(item.word, value) && _.includes(prevItem.word, key) &&
        _.indexOf(item.word, value[0]) === _.indexOf(prevItem.word, key[0])) {
        ifAlternation = true;
      }
    });
    return ifAlternation;
  }


  public PartOfSpeechChange(item, prevItem) {
    if (prevItem.category !== undefined && item.category !== prevItem.category) {
      return true;
    } else {
      return false;
    }
  }


  public async checkDertivationType(item, prevItem) {
    const dictOfExceptions = await this.load.loadJson('exceptions.json');
    const rules = (await this.load.loadJson('derivTypes.json'));
    _.forEach(rules[prevItem.category][item.category], (affix, derivType) => {
      if (affix.startsWith('-') && prevItem.word.endsWith(affix.substring(1))) {
        this.infoBase.derivType = derivType;
        this.infoBase.derProcess = 'suffixation';
        if (derivType === 'tel' && this.infoBase.czechInput.endsWith('ka')) {
          this.infoBase.gender = 'F';
        } else if (dictOfExceptions['IA'].includes(this.infoBase.czechInput)) {
          this.infoBase.gender = 'IA';
        } else {
          this.infoBase.gender = 'M';
        }
      }
    });
  }


  public ifPrefixToRoot(item, itemList) {
    const prefix = this.getPrefix(item);
    let ifPrefix = false;
    let prevItem;
    if (prefix) {
      while (item.parent !== undefined) {
        if (ifPrefix) {
          break;
        }
        prevItem = item;
        item = _.find(itemList, ['id', item.parent]);
        if (prefix !== item.word.substring(0, prefix.length) &&
          prevItem.category === 'V' &&
          item.category === 'V'
        ) {
          this.infoBase.prefix = prefix;
          this.infoBase.isPrefig = true;
          ifPrefix = true;
        }
      }
    }
    return ifPrefix;
  }


  public ifPrefix(item, prevItem) {
    const prefix = this.getPrefix(prevItem);
    if (
      prefix &&
      prefix !== item.word.substring(0, prefix.length) &&
      prevItem.category === 'V' &&
      item.category === 'V'
    ) {
      this.infoBase.prefix = prefix;
      this.infoBase.isPrefig = true;
      return true;
    } else {
      return false;
    }
  }


  public getPrefix(prevItem) {
    let prefix;
    _.forEach(this.prefixes, (value) => {
      if (prevItem.word.startsWith(value)) {
        prefix = value;
      }
    });
    return prefix;
  }


  public convertLineToObject(line: string) {
    const columns = line.split('\t');
    return {
      id: columns[0],
      word: columns[1],
      description: columns[2],
      category: columns[3],
      parent: columns[4]
    };
  }
}
