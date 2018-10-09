import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private http: HttpClient) {}

  public word = '';
  public outputWord = '';

  public loadTsv() {
    console.log("LOADING")
    return this.http.get("/assets/derinet-1-5-1.tsv", {responseType: "text"}).pipe(
      take(1)
    ).toPromise();
  }

  public async analyze(inputWord) { 
    this.outputWord = inputWord.split("").reverse().join("")
    let tsvContent = (await this.loadTsv()).split("\n");
    let items = _.map(tsvContent, this.convertLineToObject)
    let item = _.find(items, ["word", inputWord]);
    while(item.parent != "") {
      item = _.find(items, ["id", item.parent]);
    }
    console.log("lOADED")
    console.log(item)
    return item;
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
