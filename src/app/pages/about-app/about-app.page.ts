import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.page.html',
  styleUrls: ['./about-app.page.scss'],
})
export class AboutAppPage implements OnInit {

  constructor(public menu: MenuController) { }

  ngOnInit() {
  }

  public openMenu() {
    this.menu.open();
  }

}
