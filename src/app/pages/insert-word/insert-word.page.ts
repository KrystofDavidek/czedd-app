import { DatabaseService } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../../services/analyze.service';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-insert-word',
  templateUrl: './insert-word.page.html',
  styleUrls: ['./insert-word.page.scss'],
})
export class InsertWordPage implements OnInit {

  constructor(public analyzator: AnalyzeService, public formator: FormatService, public database: DatabaseService) {
    if (this.analyzator.inputWordFromIndex !== '') {
      this.inputWord = this.analyzator.inputWordFromIndex;
      this.analyzator.inputWordFromIndex = '';
      this.analyze();
    }
    /* this.database.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.dbIsLoaded = true;
      }
    }); */
  }

  public inputWord = '';
  public definition;
  public errorMessage = '';
  public isLoading = false;

  public word = {};
  public words = [];
  public dbIsLoaded = false;


  ngOnInit() {
/*     this.anaylze();
 */  }


  public async analyze() {
    this.isLoading = true;
    let infoBase;
    this.errorMessage = '';
    this.definition = undefined;
    infoBase = await this.analyzator.analyze(this.inputWord);
    this.isLoading = false;
    if (typeof infoBase === 'string' || infoBase instanceof String || infoBase.czechParent === infoBase.czechInput) {
      this.errorMessage = 'Wrong input.';
    } else {
      this.definition = await this.formator.createDefinition(infoBase);
    }
  }


  public loadWord(word) {
    this.database.loadWord(word).then(data => {
      this.words = data;
      console.log(this.words);
    });
  }



}
