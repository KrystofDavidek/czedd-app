import { InsertWordPage } from './../insert-word/insert-word.page';
import { MenuPage } from './menu.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AboutAppPage } from '../about-app/about-app.page';
import { AboutUsPage } from '../about-us/about-us.page';
import { IndexPage } from '../index/index.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'insertWord',
        outlet: 'menucontent',
        component: InsertWordPage
      },
      {
        path: 'index',
        outlet: 'menucontent',
        component: IndexPage
      },
      {
        path: 'aboutApp',
        outlet: 'menucontent',
        component: AboutAppPage
      },
      {
        path: 'aboutUs',
        outlet: 'menucontent',
        component: AboutUsPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/(menucontent:insertWord)'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
