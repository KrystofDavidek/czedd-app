import { IndexingService } from './../../services/indexing.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  constructor(public index: IndexingService) { }

  public something;

  ngOnInit() {
  }

  public async makeAlphDict() {
    this.something = await this.index.makeAlphDict();
    console.log(this.something);
  }

}
