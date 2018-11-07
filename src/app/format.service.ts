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
      derProcess: 'Derivation process: suffix'
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

    mainResult.englishLine = `Someone (masculine animate) who ${infoBase.englishParent}s`
    return mainResult
  }


  public telTypePracovat(infoBase) {
    if (infoBase.isPrefig) {
      if (infoBase.czechInput.match(/^.*ov[aá]vatel$/)) {
        return `${infoBase.czechInput.substring(0, infoBase.czechInput.length - 7)}vává`
      }
      else {
        return `${infoBase.czechInput.substring(0, infoBase.czechInput.length - 5)}vává`
      }
    }
    else {
      return `${infoBase.czechInput.substring(0, infoBase.czechInput.length - 6)}uje`
    }
  }


  public async getThirdPerson(infoBase) {
    let thirdPerson = ''
    let dictOfExceptions = await this.load.loadJson('exceptions.json')
    if (this.exceptions.isExcept(infoBase.czechParent, infoBase.derivType, dictOfExceptions)) {
      return this.exceptions.findExcept(infoBase.czechParent, infoBase.derivType, dictOfExceptions)
    }
    if (infoBase.czechInput.match(/^.*ov[aá](va)?tel$/)) {
      thirdPerson = this.telTypePracovat(infoBase)
    }
    else {
      thirdPerson = '...'
    }
    return thirdPerson
  }
}

