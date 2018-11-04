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
    this.experiment()
    this.anaylze()
  }
  public inputWord = 'vykonavatel'
  public output
  public errorMessage = ''
  
  public async anaylze() {
    let outputObject
    this.output = undefined
    outputObject = await this.analyzator.analyze(this.inputWord)
    if (typeof outputObject === 'string' || outputObject instanceof String) {
      this.errorMessage = 'Wrong input.'
    }
    else {
    this.output = this.formator.createDefinition(outputObject)
    }
  }

  public experiment() {
    let something = undefined
    if (something) {
      //console.log('True')
    }
    else {
      //console.log('False')
    }
  }
}
