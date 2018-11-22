import { Injectable } from '@angular/core';
import { ExceptionsService } from './exceptions.service';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  constructor(private exceptions: ExceptionsService, private load: LoadFileService) { }


  public async createDefinition(infoBase) {
    let definiton;
    if (infoBase.derivType === 'tel') {
      definiton = await this.telDefinition(infoBase);
    }
    return definiton;
  }


  public async telDefinition(infoBase) {
    const definiton = {
      main: {},
      derivational: {},
      morphological: {}
    };
    definiton.main = await this.telMain(infoBase);
    definiton.derivational = {
      caption: 'Derivation information',
      baseWord: `Base word: ${infoBase.czechParent}`,
      derProcess: `Derivation process: ${infoBase.derProcess}`
    };
    definiton.morphological = {
      caption: 'Morphological information',
      partOfSpeech: 'Part of speech: Noun',
      gender: 'Noun gender: Masculine Animate',
      paradigm: 'Noun paradigm: ...',
    };
    return definiton;
  }


  public async telMain(infoBase) {
    const mainResult = {
      caption: 'Definition',
      firstLine: '',
      czechLine: '',
      englishLine: ''
    };
    const thirdPerson = await this.getThirdPerson(infoBase);

    if (infoBase.gender === 'F') {
      const inputName = infoBase.czechInput.substring(0, infoBase.czechInput.length - infoBase.derivType.length - 1);
      mainResult.firstLine = `${inputName}-${infoBase.derivType}ka`;
      mainResult.czechLine = `Ta, která ${thirdPerson} (infinitive: ${infoBase.czechParent})`;
      mainResult.englishLine = `Someone who ${infoBase.englishParent}s (feminine)`;
    } else {
      const inputName = infoBase.czechInput.substring(0, infoBase.czechInput.length - infoBase.derivType.length + 1);
      mainResult.firstLine = `${inputName}-${infoBase.derivType}`;
      mainResult.czechLine = `Ten, kdo ${thirdPerson} (infinitive: ${infoBase.czechParent})`;
      mainResult.englishLine = `Someone who ${infoBase.englishParent}s (masculine animate)`;
    }
    return mainResult;
  }


  public telTypePracovat(infoBase) {
    const verb = infoBase.czechParent;
    if (infoBase.isPrefig && verb.match(/^.*ov[aá]vat$/)) {
      return `${verb.substring(0, verb.length - 4)}ává`;
    } else if (infoBase.isPrefig) {
      if (infoBase.gender === 'F') {
        return `${verb.substring(0, verb.length - 4)}ovala
        nebo ${verb.substring(0, verb.length - 4)}uje`;
      } else {
        return `${verb.substring(0, verb.length - 4)}oval
        nebo ${verb.substring(0, verb.length - 4)}uje`;
      }
    } else {
      return `${verb.substring(0, verb.length - 4)}uje`;
    }
  }


  public telTypeFourth(infoBase) {
    const verb = infoBase.czechParent;
    if (verb.match(/^.*ívat$/)) {
      return `${verb.substring(0, verb.length - 4)}ívá`;
    } else if (infoBase.isPrefig && verb.match(/^.*ovat$/)) {
      return `${verb.substring(0, verb.length - 4)}uje`;
    } else if (infoBase.isPrefig && verb.charAt(verb.length - 2) === 'e') {
      if (infoBase.gender === 'F') {
        return `${verb.substring(0, verb.length - 2)}ela
        nebo ${verb.substring(0, verb.length - 2)}í`;
      } else {
        return `${verb.substring(0, verb.length - 2)}el
        nebo ${verb.substring(0, verb.length - 2)}í`;
      }
    } else if ((infoBase.isPrefig && verb.charAt(verb.length - 2) === 'i')) {
      if (infoBase.gender === 'F') {
        return `${verb.substring(0, verb.length - 2)}ěla
        nebo ${verb.substring(0, verb.length - 2)}í`;
      } else {
        return `${verb.substring(0, verb.length - 2)}ěl
        nebo ${verb.substring(0, verb.length - 2)}í`;
      }
    } else {
      return `${verb.substring(0, verb.length - 2)}í`;
    }
  }


  public telTypeOthers(infoBase) {
    const verb = infoBase.czechParent;
    if (
      verb.charAt(verb.length - 2) === 'a' &&
      infoBase.isPrefig &&
      verb.match(/^.*ávat$/)
    ) {
      return `${verb.substring(0, verb.length - 4)}ává`;
    } else if (infoBase.isPrefig) {
      if (infoBase.gender === 'F') {
        return `${verb.substring(0, verb.length - 2)}ála
        nebo ${verb.substring(0, verb.length - 2)}á`;
      } else {
        return `${verb.substring(0, verb.length - 2)}ál
        nebo ${verb.substring(0, verb.length - 2)}á`;
      }
    } else {
      return `${verb.substring(0, verb.length - 2)}á`;
    }
  }


  public async telType(infoBase) {
    const verb = infoBase.czechParent;
    let thirdPerson = '';
    const dictOfExceptions = await this.load.loadJson('exceptions.json');
    if (this.exceptions.isExcept(verb, infoBase.derivType, infoBase.gender, dictOfExceptions)) {
      return this.exceptions.findExcept(verb, infoBase.derivType, infoBase.gender, dictOfExceptions);
    }
    if (verb.match(/^.*ov[aá](va)?t$/)) {
      thirdPerson = this.telTypePracovat(infoBase);
    } else if ((verb.match(/^.*[ieě]t$/))) {
      thirdPerson = this.telTypeFourth(infoBase);
    } else {
      thirdPerson = this.telTypeOthers(infoBase);
    }
    return thirdPerson;
  }


  public async getThirdPerson(infoBase) {
    let thirdPerson;
    if (infoBase.derivType === 'tel') {
      thirdPerson = await this.telType(infoBase);
    }
    return thirdPerson;
  }
}

