import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor() { }


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
      telMain : {},
      telSecondary : {}
    }
    mainDefiniton.telMain = this.telMain(outputObject)
    mainDefiniton.telSecondary = {
      caption: 'Derivation information',
      baseWord : 'Base word: ' +  outputObject.czechParent,
      derProcess: 'Derivation process: suffix'
    }
    return mainDefiniton
    
  }


  public telMain(outputObject) {
    let mainResult = {
      caption : 'Definiton',
      firstLine : '',
      czechLine : '',
      englishLine: ''}

    let inputName = outputObject.czechInput.substring(0, outputObject.czechInput.length - outputObject.derivType.length + 1)
    mainResult.firstLine = inputName + "-" + outputObject.derivType
    let thirdPerson = this.getThirdPerson(outputObject.czechInput, outputObject.derivType)
    mainResult.czechLine = 'ten, kdo ' + thirdPerson + ' (infinitive: ' + outputObject.czechParent + ')'
    mainResult.englishLine = 'someone (masculine animate) who ' + outputObject.englishParent + 's'
    return mainResult

  }


  public getThirdPerson(verb, derivType) {
    let thirdPerson = verb.substring(0, verb.length - derivType.length)
    let lastLetter = thirdPerson[thirdPerson.length - 1]
    for (var key in this.dictOfVocals) {
      if (key == lastLetter) {
        lastLetter = this.dictOfVocals[key]
      }
    }
    thirdPerson = thirdPerson.slice(0, -1) + lastLetter
    return thirdPerson
  }


  public telSecondary (outputObject) {
    let secondaryResult = {
      caption: 'Derivation information',
      baseWord : 'Base word: ' +  outputObject.czechParent,
      derProcess: 'Derivation process: suffix'
    }
    return secondaryResult


  }

}

