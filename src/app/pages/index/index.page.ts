import { IndexingService } from './../../services/indexing.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(public index: IndexingService) {
    this.makeAlphDict();
  }

  public dict;

  ngOnInit() {
  }

  public async makeAlphDict() {
    this.dict = await this.index.makeAlphDict();
    console.log(this.dict);
  }

}
