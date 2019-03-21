import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { LoadFileService } from './load-file.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Http } from '@angular/http';
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
        name: 'drinet.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }

  public async initDatabase() {
    const sqlLiteDb = (await this.load.loadFile('derinet.sql'));
    console.log(sqlLiteDb);
  }

  public runSqlQuery() {
    console.log('Done');

  }

  fillDatabase() {
    this.load.loadSQl('dummyDump.sql')
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }


  loadOneDeveloper(name) {
    return this.database.executeSql('SELECT * FROM developer WHERE name=\'Max\';', []).then((data) => {
      const developer = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developer.push({
            name: data.rows.item(i).name, skill: data.rows.item(i).skill,
            yearsOfExperience: data.rows.item(i).yearsOfExperience
          });
        }
      }
      return developer;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }


  getAllDevelopers() {
    return this.database.executeSql('SELECT * FROM developer', []).then((data) => {
      const developers = [];
      console.log(data);
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          developers.push({
            name: data.rows.item(i).name, skill: data.rows.item(i).skill,
            yearsOfExperience: data.rows.item(i).yearsOfExperience
          });
        }
      }
      return developers;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }







}




