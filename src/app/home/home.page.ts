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
  public inputWord = 'kovatel'
  public output
  public errorMessage = ''
  
  public async anaylze() {
    let outputObject
    this.errorMessage = ''
    this.output = undefined
    outputObject = await this.analyzator.analyze(this.inputWord)
    if (typeof outputObject === 'string' || outputObject instanceof String) {
      this.errorMessage = 'Wrong input.'
    }
    else {
      this.output = this.formator.createDefinition(outputObject)
    }
  }

  public test(outputObject) {
    var rules = {
      
          "N" : {
              "V" : {
                  "tel" : "tel"
              }
          }
      
    }
    var derType = rules.N.V.tel
    console.log(derType)
  }
}
