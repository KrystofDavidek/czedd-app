
import { MenuRoutingModule } from './menu-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { AboutUsPageModule } from '../about-us/about-us.module';
import { AboutAppPageModule } from '../about-app/about-app.module';
import { InsertWordPageModule } from '../insert-word/insert-word.module';
import { IndexPageModule } from './../index/index.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuRoutingModule,
    AboutUsPageModule,
    AboutAppPageModule,
    InsertWordPageModule,
    IndexPageModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule { }
