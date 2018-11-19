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
    // this.test(infoBase)
    this.anaylze() 
  }
  public inputWord = 'učitelka'
  public definition
  public errorMessage = ''
  public isLoading = false
  
  public async anaylze() {
    this.isLoading = true
    let infoBase
    this.errorMessage = ''
    this.definition = undefined
    infoBase = await this.analyzator.analyze(this.inputWord)
    this.isLoading = false
    if (typeof infoBase === 'string' || infoBase instanceof String) {
      this.errorMessage = 'Wrong input.'
    } else {
      this.definition = await this.formator.createDefinition(infoBase)
    }
  }

  public test(infoBase) {
    let list = ['a', 'b']
  }
}
