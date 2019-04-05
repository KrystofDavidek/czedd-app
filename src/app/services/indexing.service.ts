import { LoadFileService } from './load-file.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class IndexingService {

  constructor(public load: LoadFileService) {
  }


  public alphDict;


  public async makeAlphDict() {
    const alphDict = {};
    let letter = '';
    const tsvContent = (await this.load.loadFile('telka_beta.tsv')).split('\n');
    console.log('LOADING ...');

    const itemsList = _.map(tsvContent, this.convertLineToObject);
    _.forEach(itemsList, (item) => {
      if ('word' in item) {
        const word = item['word'];
        if (!(/[A-Z]/.test(word[0])) && (word.endsWith('tel') || word.endsWith('telka')) && this.ifDerivated(item, itemsList)) {
          if (letter !== word[0]) {
            letter = word[0];
          }
          if (!(letter in alphDict)) {
            alphDict[letter] = [];
          }
          alphDict[letter].push(word);
        }
      }
    });
    return alphDict;
  }


  public ifDerivated(item, itemList): boolean {
    let result = false;
    let parent;
    if ('parent' in item) {
      if (_.find(itemList, { id: item.parent, category: 'V' })) {
        result = true;
      } else {
        parent = _.find(itemList, { id: item.parent, category: 'N' });
        if (parent && 'parent' in parent) {
          if (_.find(itemList, { id: parent.parent, category: 'V' })) {
            result = true;
          }
        }
      }
      return result;
    }
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





