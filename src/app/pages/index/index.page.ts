import { AnalyzeService } from './../../services/analyze.service';
import { IndexingService } from './../../services/indexing.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as _ from 'lodash';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(public index: IndexingService, public nav: NavController, public analyzator: AnalyzeService) {
    this.makeAlphDict();
  }

  public dict;
  public showPart = false;
  public partOfDict = [];
  public chunkPartOfDict = [];
  public listOfAlph = [];
  public loading = true;
  public chunk = 0;


  ngOnInit() {
  }

  public async makeAlphDict() {
    if (!this.index.alphDict) {
      this.dict = await this.index.makeAlphDict();
      this.index.alphDict = this.dict;
    } else {
      this.dict = this.index.alphDict;
    }
    this.listOfAlph = Object.keys(this.dict).sort();
    this.loading = false;
    console.log(this.listOfAlph);
  }


  public backToLetters() {
    this.showPart = false;
    this.chunk = 0;
  }


  public toAnalyze(word: string) {
    this.analyzator.inputWordFromIndex = word;
  }


  public loadMore(infiniteScroll) {
    this.chunk++;
    this.partOfDict = _.compact(_.concat(this.partOfDict, this.chunkPartOfDict[this.chunk]));
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }


  public showPartOfDict(letter: string) {
    let nonUniqPartOfDict;
    console.log(letter);
    if (letter in this.dict) {
      nonUniqPartOfDict = this.dict[letter].sort();
      this.chunkPartOfDict = nonUniqPartOfDict.filter((item, pos) => {
        return nonUniqPartOfDict.indexOf(item) === pos;
      });
      this.chunkPartOfDict = _.chunk(this.chunkPartOfDict, 24);
      this.partOfDict = this.chunkPartOfDict[this.chunk];
      this.showPart = true;
    } else {
      console.log('Words do not exist');
    }
  }

}
