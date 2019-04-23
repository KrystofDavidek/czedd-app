import { LoadFileService } from './load-file.service';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class IndexingService {

  constructor(public load: LoadFileService, private nativeStorage: NativeStorage) {
  }


  public alphDict = {};
  public show = '';


  public async getDataFromStorage() {
    await this.nativeStorage.getItem('alphDict')
      .then(
        data => this.alphDict = data,
        error => console.error(error)
      );
  }


  public async loadDataToStorage(data: {}) {
    await this.nativeStorage.setItem('alphDict', data)
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
  }


  public async makeAlphDict() {
    await this.getDataFromStorage();
    if (Object.keys(this.alphDict).length) {
      console.log('AlphDict is in Storage');
    } else {
      console.log('AlphDict is NOT in Storage');
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
      await this.loadDataToStorage(alphDict);
      this.alphDict = alphDict;
    }
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





