import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../analyze.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public analyzator:AnalyzeService) { }

  ngOnInit() {
  }

  public inputWord = ''
  public output = '' 
  
  public async anaylze() {
    let outputResult = []
    outputResult = await this.analyzator.analyze(this.inputWord)
    if (outputResult.length != 1) {
      this.output = outputResult[0] + ' in English means ' + outputResult[1]
    }
    else {
      this.output = outputResult[0]
    }

  }
}
