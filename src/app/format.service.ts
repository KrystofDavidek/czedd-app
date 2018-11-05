import { Injectable } from '@angular/core';
import { ExceptionsService } from './exceptions.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private exceptions:ExceptionsService) { }


  public dictOfVocals = {
    'a' : 'á',
    'e' : 'é',
    'i' : 'í',
    'o' : 'ó',
    'u' : 'ů',
  }


  public createDefinition(outputObject) {
    let definiton
    if (outputObject.derivType == 'tel') {
      definiton = this.telDefinition(outputObject)
    }
    return definiton
  }


  public telDefinition(outputObject) {
    let mainDefiniton = {
      Main : {},
      Secondary : {}
    }
    mainDefiniton.Main = this.telMain(outputObject)
    mainDefiniton.Secondary = {
      caption: 'Derivation information',
      baseWord : `Base word: ${outputObject.czechParent}`,
      derProcess: 'Derivation process: suffix'
    }
    return mainDefiniton
    
  }


  public telMain(outputObject) {
    let mainResult = {
      caption : 'Definition',
      firstLine : '',
      czechLine : '',
      englishLine: ''}

    let inputName = outputObject.czechInput.substring(0, outputObject.czechInput.length - outputObject.derivType.length + 1)
    mainResult.firstLine = `${inputName}-${outputObject.derivType}`

    let thirdPerson = this.getThirdPerson(outputObject)
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


  public getThirdPerson(outputObject) {
    let thirdPerson = ''
    if (this.exceptions.isExcept(outputObject.czechParent)) {
      return this.exceptions.findExcept(outputObject.czechParent)
    }
    if (outputObject.czechInput.match(/^.*ova(v[aá])?tel$/)) {
      thirdPerson = this.telTypePracovat(outputObject)
    }
    else {
      console.log('yes')
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

