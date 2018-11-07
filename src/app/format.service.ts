import { Injectable } from '@angular/core';
import { ExceptionsService } from './exceptions.service';
import { LoadFileService } from './load-file.service';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private exceptions:ExceptionsService, private load:LoadFileService) { }


  public async createDefinition(outputObject) {
    let definiton
    if (outputObject.derivType == 'tel') {
      definiton = await this.telDefinition(outputObject)
    }
    return definiton
  }


  public async telDefinition(outputObject) {
    let mainDefiniton = {
      Main : {},
      Secondary : {}
    }
    mainDefiniton.Main = await this.telMain(outputObject)
    mainDefiniton.Secondary = {
      caption: 'Derivation information',
      baseWord : `Base word: ${outputObject.czechParent}`,
      derProcess: 'Derivation process: suffix'
    }
    return mainDefiniton
    
  }


  public async telMain(outputObject) {
    let mainResult = {
      caption : 'Definition',
      firstLine : '',
      czechLine : '',
      englishLine: ''}

    let inputName = outputObject.czechInput.substring(0, outputObject.czechInput.length - outputObject.derivType.length + 1)
    mainResult.firstLine = `${inputName}-${outputObject.derivType}`

    let thirdPerson = await this.getThirdPerson(outputObject)
    mainResult.czechLine = `Ten, kdo ${thirdPerson} (infinitive: ${outputObject.czechParent})`
    mainResult.englishLine = `Someone (masculine animate) who ${outputObject.englishParent}s`
    return mainResult
  }


  public telTypePracovat(outputObject) {
    if (outputObject.isPrefig) {
      return `${outputObject.czechInput.substring(0, outputObject.czechInput.length - 5)}vává`
    }
    else {
      return `${outputObject.czechInput.substring(0, outputObject.czechInput.length - 6)}uje`
    }
  }


  public async getThirdPerson(outputObject) {
    let thirdPerson = ''
    let dictOfExceptions = await this.load.loadJson('exceptions.json')
    if (this.exceptions.isExcept(outputObject.czechParent, outputObject.derivType,dictOfExceptions)) {
      return this.exceptions.findExcept(outputObject.czechParent, outputObject.derivType,dictOfExceptions)
    }
    if (outputObject.czechInput.match(/^.*ov[aá](va)?tel$/)) {
      thirdPerson = this.telTypePracovat(outputObject)
    }
    else {
      thirdPerson = '...'
    }
    return thirdPerson
  }


  public telSecondary (outputObject) {
    let secondaryResult = {
      caption: 'Derivation information',
      baseWord : `Base word: ${outputObject.czechParent}`,
      derProcess: 'Derivation process: suffix'
    }
    return secondaryResult
  }
}

