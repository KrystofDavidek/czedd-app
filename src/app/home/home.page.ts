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
  public outputWord = ''
  
  public anaylze() {
    this.outputWord = this.analyzator.analyze(this.inputWord)
}
  }
