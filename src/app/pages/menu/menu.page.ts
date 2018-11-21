import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';

  pages = [
    {
      title: 'About App',
      url: '/menu/(menucontent:aboutApp)'
    },
    {
      title: 'Insert Word',
      url: '/menu/(menucontent:insertWord)'
    },
    {
      title: 'About Us',
      url: '/menu/(menucontent:aboutUs)'
    }
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
      if (this.selectedPath === '/') {
        this.selectedPath = '/menu/(menucontent:insertWord)';
        event.url = '/menu/(menucontent:insertWord)';
      }
    });
  }

  ngOnInit() {
  }

}
