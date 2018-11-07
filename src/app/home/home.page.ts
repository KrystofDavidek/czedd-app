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
    
    this.anaylze() 
  }
  public inputWord = 'zpracovávatel'
  public definition
  public errorMessage = ''
  
  public async anaylze() {
    let outputObject
    this.errorMessage = ''
    this.definition = undefined
    outputObject = await this.analyzator.analyze(this.inputWord)
    if (typeof outputObject === 'string' || outputObject instanceof String) {
      this.errorMessage = 'Wrong input.'
    }
    else {
      this.definition = await this.formator.createDefinition(outputObject)
    }
  }

  public test(outputObject) {
    let list = ['a', 'b']
  }
}
