import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../../services/analyze.service';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-insert-word',
  templateUrl: './insert-word.page.html',
  styleUrls: ['./insert-word.page.scss'],
})
export class InsertWordPage implements OnInit {

  constructor(public analyzator: AnalyzeService, public formator: FormatService) { }

  public inputWord = 'kupitel';
  public definition;
  public errorMessage = '';
  public isLoading = false;

  ngOnInit() {
    // this.test(infoBase)
    this.anaylze();
  }

  public async anaylze() {
    this.isLoading = true;
    let infoBase;
    this.errorMessage = '';
    this.definition = undefined;
    infoBase = await this.analyzator.analyze(this.inputWord);
    this.isLoading = false;
    if (typeof infoBase === 'string' || infoBase instanceof String) {
      this.errorMessage = 'Wrong input.';
    } else {
      this.definition = await this.formator.createDefinition(infoBase);
    }
  }

  public test(infoBase) {
    const list = ['a', 'b'];
  }
}
