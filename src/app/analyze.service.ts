import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { LoadFileService } from './load-file.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private load: LoadFileService) {}

  public word = '';
  public outputWord = '';

  public async analyze(inputWord) { 
    let tsvContent = (await this.load.loadTsv('derinet-1-5-1.tsv')).split("\n");
    let items = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(items, ["word", inputWord])
    if (!(item)) {
      return 'Slovo neexistuje.'
    }
    while(item.parent != "") {
      item = _.find(items, ["id", item.parent]);
    }
    this.outputWord = item.word.replace(/['"]+/g, '');
    console.log(item)
    return this.outputWord
  }

  public convertLineToObject(line: string) {
    let columns = line.split("\t");
    return {
      id: columns[0],
      word: columns[1],
      description: columns[2],
      category: columns[3],
      parent: columns[4]
    }

  }
}
