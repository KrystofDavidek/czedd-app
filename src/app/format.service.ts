import { Injectable } from '@angular/core';
import { ExceptionsService } from './exceptions.service';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private exceptions:ExceptionsService, private load:LoadFileService) { }


  public async createDefinition(infoBase) {
    let definiton
    if (infoBase.derivType == 'tel') {
      definiton = await this.telDefinition(infoBase)
    }
    return definiton
  }


  public async telDefinition(infoBase) {
    let definiton = {
      main : {},
      secondary : {}
    }
    definiton.main = await this.telMain(infoBase)
    definiton.secondary = {
      caption: 'Derivation information',
      baseWord : `Base word: ${infoBase.czechParent}`,
      derProcess: `Derivation process: ${infoBase.derProcess}`
    }
    return definiton
  }


  public async telMain(infoBase) {
    let mainResult = {
      caption : 'Definition',
      firstLine : '',
      czechLine : '',
      englishLine: ''
    }

    let inputName = infoBase.czechInput.substring(0, infoBase.czechInput.length - infoBase.derivType.length + 1)
    mainResult.firstLine = `${inputName}-${infoBase.derivType}`

    let thirdPerson = await this.getThirdPerson(infoBase)
    mainResult.czechLine = `Ten, kdo ${thirdPerson} (infinitive: ${infoBase.czechParent})`

    mainResult.englishLine = `Someone who ${infoBase.englishParent}s (masculine animate)`
    return mainResult
  }


  public telTypePracovat(infoBase) {
    let verb = infoBase.czechParent
    if (infoBase.isPrefig && verb.match(/^.*ov[aá]vat$/)) {
      return `${verb.substring(0, verb.length - 4)}ává`
    } else if (infoBase.isPrefig) {
      return `${verb.substring(0, verb.length - 4)}oval
      nebo ${verb.substring(0, verb.length - 4)}uje`
    } else {
      return `${verb.substring(0, verb.length - 4)}uje`
    }
  }


  public telTypeFourth(infoBase) {
    let verb = infoBase.czechParent
    if (verb.match(/^.*ívat$/)) {
      return `${verb.substring(0, verb.length - 4)}ívá`
    } else if (infoBase.isPrefig && verb.match(/^.*ovat$/)) {
      return `${verb.substring(0, verb.length - 4)}uje`
    } else if (infoBase.isPrefig && verb.charAt(verb.length - 2) === 'e') {
      return `${verb.substring(0, verb.length - 2)}el
      nebo ${verb.substring(0, verb.length - 2)}í`
    } else if ((infoBase.isPrefig && verb.charAt(verb.length - 2) === 'i')) {
      return `${verb.substring(0, verb.length - 2)}ěl
      nebo ${verb.substring(0, verb.length - 2)}í`
    } else {
      return `${verb.substring(0, verb.length - 2)}í`
    }
  }


  public telTypeOthers(infoBase) {
    let verb = infoBase.czechParent
    if (
      verb.charAt(verb.length - 2) === 'a' &&
      infoBase.isPrefig &&
      verb.match(/^.*ávat$/)
    ) {
      return `${verb.substring(0, verb.length - 4)}ává`
    } else if (infoBase.isPrefig) {
      return `${verb.substring(0, verb.length - 2)}ál
      nebo ${verb.substring(0, verb.length - 2)}á`
    } else { 
      return `${verb.substring(0, verb.length - 2)}á`
    }
  }


  public async telType(infoBase) {
    let verb = infoBase.czechParent
    let thirdPerson = ''
    let dictOfExceptions = await this.load.loadJson('exceptions.json')
    if (this.exceptions.isExcept(verb, infoBase.derivType, dictOfExceptions)) {
      return this.exceptions.findExcept(verb, infoBase.derivType, dictOfExceptions)
    }
    if (verb.match(/^.*ov[aá](va)?t$/)) {
      thirdPerson = this.telTypePracovat(infoBase)
    } else if ((verb.match(/^.*[ieě]t$/))) {
      thirdPerson = this.telTypeFourth(infoBase)
    } else {
      thirdPerson = this.telTypeOthers(infoBase) 
    }
    return thirdPerson
  } 


  public async getThirdPerson(infoBase) {
    let thirdPerson
    if (infoBase.derivType === 'tel') {
      thirdPerson = await this.telType(infoBase)
    }
    return thirdPerson
  }
}

