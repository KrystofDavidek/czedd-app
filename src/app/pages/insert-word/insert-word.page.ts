import { Router, ActivatedRoute } from '@angular/router';
import { IndexingService } from './../../services/indexing.service';
import { DatabaseService } from './../../services/database.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { AnalyzeService } from '../../services/analyze.service';
import { FormatService } from '../../services/format.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-insert-word',
  templateUrl: './insert-word.page.html',
  styleUrls: ['./insert-word.page.scss'],
})

export class InsertWordPage implements OnInit {

  constructor(
    public analyzator: AnalyzeService,
    public formator: FormatService,
    /* public database: DatabaseService, */
    public index: IndexingService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public zone: NgZone
  ) {
    this.activatedRoute.params.subscribe(val => {
      this.init();
    });
  }

  public listOfWords = [];
  public mainLoading = true;
  public dict;
  public showDefinition = false;
  public analyzedWord: string;
  public showBack = false;

  public inputWord = '';
  public definition;
  public errorMessage = '';
  public definitionLoading = false;


  ngOnInit() {
  }


  public init() {
    console.log('Change!');
    if (this.analyzator.inputWordFromIndex !== '') {
      this.inputWord = this.analyzator.inputWordFromIndex;
      this.analyzator.inputWordFromIndex = '';
      this.analyze();
      this.showBack = true;
    }
    this.mainLoading = true;
    this.makeDict();
  }


  public async makeDict() {
    if (!Object.keys(this.index.alphDict).length) {
      await this.index.makeAlphDict();
      this.dict = this.index.alphDict;
    } else {
      this.dict = this.index.alphDict;
    }
    this.mainLoading = false;
    console.log(this.dict);
  }


  public showWords(ifShow: boolean) {
    const lowerCaseWord = this.inputWord.toLowerCase();
    if (this.analyzedWord !== this.inputWord || !ifShow) {
      if (this.showDefinition) {
        this.showDefinition = false;
      }
      if (ifShow) {
        if (lowerCaseWord) {
          this.listOfWords = _.filter(this.dict[lowerCaseWord[0]], (word) => {
            return word.startsWith(lowerCaseWord);
          });
          this.showBack = false;
        } else {
          this.listOfWords = [];
        }
      } else {
        this.inputWord = '';
        this.listOfWords = [];
      }
    }
  }


  public async analyze(inputWord?) {
    if (inputWord) {
      this.inputWord = inputWord;
    }
    this.analyzedWord = this.inputWord;
    this.definitionLoading = true;
    let infoBase;
    this.errorMessage = '';
    this.definition = undefined;
    infoBase = await this.analyzator.analyze(this.inputWord);
    if (typeof infoBase === 'string' || infoBase instanceof String || infoBase.czechParent === infoBase.czechInput) {
      this.errorMessage = 'Wrong input.';
    } else {
      this.definition = await this.formator.createDefinition(infoBase);
    }
    this.definitionLoading = false;
    this.showDefinition = true;
  }


  public goToIndex() {
    this.mainLoading = true;
    this.index.show = this.inputWord[0];
    console.log(this.index.show);
    this.inputWord = '';
    this.showBack = false;
    this.mainLoading = false;
    this.zone.run(() => {
      this.router.navigateByUrl('/menu/(menucontent:index)');
    });
  }
}
