import { Injectable } from '@angular/core';
import { ExceptionsService } from './exceptions.service';
import { LoadFileService } from './load-file.service';
import * as _ from 'lodash';

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


  public async getThirdPerson(infoBase) {
    let thirdPerson;
    if (infoBase.derivType === 'tel') {
      thirdPerson = await this.telTypeNew(infoBase);
    }
    return thirdPerson;
  }


  public async telTypeNew(infoBase) {
    const czechInput = infoBase.czechInput;
    const verb = infoBase.czechParent;
    let thirdPerson = '';
    const dictOfExceptions = await this.load.loadJson('exceptions.json');
    if (this.exceptions.isExcept(infoBase.czechParent, infoBase.derivType, infoBase.gender, dictOfExceptions)) {
      console.log('Výjimka');
      return this.exceptions.findExcept(infoBase.czechParent, infoBase.derivType, infoBase.gender, dictOfExceptions);
    }
    if (czechInput.match(/^.*ovatel$/)) {
      console.log('telTypeOvatel');
      thirdPerson = this.telTypeOvatel(infoBase, czechInput, verb);
    } else if (czechInput.match(/^.*[^o]vatel$/)) {
      console.log('telTypeVatel');
      thirdPerson = this.telTypeVatel(infoBase, czechInput, verb);
    } else if (czechInput.match(/^.*itel$/)) {
      console.log('telTypeItel');
      thirdPerson = this.telTypeItel(infoBase, czechInput, verb);
    } else if (czechInput.match(/^.*atel$/)) {
      console.log('telTypeAtel');
      thirdPerson = this.telTypeAtel(infoBase, czechInput, verb);
    }
    return thirdPerson;
  }


  public telTypeOvatel(infoBase, czechInput, verb) {
    if (!(czechInput.match(/^.*chovatel$/))) {
      if (infoBase.isPrefig) {
        if (this.ifWordFormInChain(infoBase.derivationPath, ['.*it', '.*nout', '.*[áa]t'], verb, false)) {
          return `${verb.substring(0, verb.length - 4)}uje`;
        } else {
          return `${verb.substring(0, verb.length - 4)}oval
        nebo ${verb.substring(0, verb.length - 4)}uje`;
        }
      } else {
        return `${verb.substring(0, verb.length - 4)}uje`;
      }
    } else if (!infoBase.isPrefig) {
      return `${verb.substring(0, verb.length - 2)}á`;
    } else {
      return `${verb.substring(0, verb.length - 2)}al
        nebo ${verb.substring(0, verb.length - 2)}á`;
    }
  }


  public ifWordFormInChain(derivationPath, listOfReg, verb: string, negation: boolean, regOfVerb?: string) {
    let result = false;
    let start = false;
    _.forEach(derivationPath, (item) => {
      if (item.word === verb) {
        start = true;
      }
      if (start) {
        _.forEach(listOfReg, (reg) => {
          if ((item.word.match(reg)) && regOfVerb === undefined && negation === false) {
            result = true;
          } else if ((item.word.match(reg)) && verb.match(regOfVerb) && negation === false) {
            result = true;
          } else if (!(item.word.match(reg)) && verb.match(regOfVerb) && negation === true) {
            result = true;
          }
        });
      }

    });
    return result;
  }


  public telTypeVatel(infoBase, czechInput, verb) {
    if ((czechInput.match(/^.*[iíě]vatel$/))) {
      return `${verb.substring(0, verb.length - 4)}ívá`;
    } else if ((czechInput.match(/^.*[yý]vatel$/))) {
      return `${verb.substring(0, verb.length - 4)}ývá`;
    } else {
      return `${verb.substring(0, verb.length - 4)}ává`;
    }
  }


  public telTypeItel(infoBase, czechInput, verb) {
    if (!infoBase.isPrefig) {
      if (this.ifWordFormInChain(infoBase.derivationPath, ['.*ou.it'], verb, false, '.*u.ovat')) {
        verb = infoBase.derivationPath[_.findIndex(infoBase.derivationPath, { word: verb }) + 1].word;
        return `${verb.substring(0, verb.length - 2)}il
        nebo ${verb.substring(0, verb.length - 2)}í`;
      } else {
        return `${verb.substring(0, verb.length - 2)}í`;
      }
    } else if (this.ifWordFormInChain(infoBase.derivationPath, ['.*it'], verb, true, '.*ovat')) {
      return `${verb.substring(0, verb.length - 2)}al`;
    } else if (verb.match(/^.*[eěi]t$/)) {
      return `${verb.substring(0, verb.length - 2)}í`;
    }

  }


  public telTypeAtel(infoBase, czechInput, verb) {
    if ((czechInput.match(/^.*[^zb]atel$/))) {
      if (!infoBase.isPrefig) {
        return `${verb.substring(0, verb.length - 2)}á`;
      } else {
        return `${verb.substring(0, verb.length - 2)}al
      nebo ${verb.substring(0, verb.length - 2)}á`;
      }
    } else if ((czechInput.match(/^.*zatel$/))) {
      if (!infoBase.isPrefig) {
        return `${verb.substring(0, verb.length - 3)}že`;
      } else {
        return `${verb.substring(0, verb.length - 3)}zal
        nebo ${verb.substring(0, verb.length - 3)}že`;
      }
    } else if ((czechInput.match(/^.*batel$/))) {
      if (!infoBase.isPrefig) {
        return `${verb.substring(0, verb.length - 3)}bá`;
      } else {
        return `${verb.substring(0, verb.length - 3)}bal
        nebo ${verb.substring(0, verb.length - 3)}bá`;
      }
    }
  }
}

