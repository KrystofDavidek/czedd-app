import { AnalyzeService } from './../../services/analyze.service';
import { IndexingService } from './../../services/indexing.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
  public listOfAlph = [];

  ngOnInit() {
  }

  public async makeAlphDict() {
    this.dict = await this.index.makeAlphDict();
    this.listOfAlph = Object.keys(this.dict).sort();
    console.log(this.listOfAlph);
  }


  public backToLetters() {
    this.showPart = false;
  }


  public toAnalyze(word: string) {
    this.analyzator.inputWordFromIndex = word;
  }


  public showPartOfDict(letter: string) {
    let nonUniqPartOfDict;
    console.log(letter);
    if (letter in this.dict) {
      nonUniqPartOfDict = this.dict[letter].sort();
      this.partOfDict = nonUniqPartOfDict.filter((item, pos) => {
        return nonUniqPartOfDict.indexOf(item) === pos;
      });
      console.log(this.partOfDict);
      this.showPart = true;
    } else {
      console.log('Words do not exist');
    }
  }

}
