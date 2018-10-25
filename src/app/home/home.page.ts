import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../analyze.service';
import { FormatService } from '../format.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public analyzator:AnalyzeService, public formator:FormatService) { }

  ngOnInit() {
  }

  public inputWord = 'vychovávatel'
  public output
  
  public async anaylze() {
    let outputObject
    outputObject = await this.analyzator.analyze(this.inputWord)
    this.output = this.formator.createDefinition(outputObject)
  }
}
