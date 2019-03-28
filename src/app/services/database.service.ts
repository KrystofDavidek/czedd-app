import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { LoadFileService } from './load-file.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public load: LoadFileService, public sqlitePorter: SQLitePorter, public sqlite: SQLite,
    public platform: Platform, public storage: Storage, public http: HttpClient) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'derinet.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
              console.log('Ready');
            } else {
              console.log('Filling');
              this.fillDatabase();
            }
          });
        });
    });
  }


  public fillDatabase() {
    this.load.loadSQl('derinet-example.sql')
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
            console.log('Filled');

          })
          .catch(e => console.error(e));
      });
  }


  public loadWord(word) {
    return this.database.executeSql('SELECT * FROM words WHERE word="' + word + '" ', []).then((data) => {
      const resultWord = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          resultWord.push({
            word: data.rows.item(i).word,
            address: data.rows.item(i).address,
            part_of_speech: data.rows.item(i).part_of_speech,
            origin: data.rows.item(i).origin,
          });
        }
      }
      return resultWord;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }


  public getDatabaseState() {
    return this.databaseReady.asObservable();
  }







}




