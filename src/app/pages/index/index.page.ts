import { AnalyzeService } from './../../services/analyze.service';
import { IndexingService } from './../../services/indexing.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(public index: IndexingService,
    public analyzator: AnalyzeService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public zone: NgZone
  ) {
    this.activatedRoute.params.subscribe(val => {
      this.init();
    }
    );
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


  public init() {
    console.log('Change!');
    this.loading = true;
    this.makeAlphDict();
    if (this.index.show) {
      this.showPartOfDict(this.index.show);
      this.index.show = '';
    }
  }


  public async makeAlphDict() {
    if (!Object.keys(this.index.alphDict).length) {
      await this.index.makeAlphDict();
      this.dict = this.index.alphDict;
    } else {
      this.dict = this.index.alphDict;
    }
    this.listOfAlph = Object.keys(this.dict).sort();
    this.loading = false;
  }


  public backToLetters() {
    this.showPart = false;
    this.chunk = 0;
  }


  public toAnalyze(word: string) {
    this.analyzator.inputWordFromIndex = word;
    // tslint:disable-next-line:no-shadowed-variable
    const NavigationExtras: NavigationExtras = {
      queryParams: {
        'word': word
      }
    };
    this.zone.run(() => {
      this.router.navigateByUrl('/menu/(menucontent:insertWord)', NavigationExtras);
    });
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
