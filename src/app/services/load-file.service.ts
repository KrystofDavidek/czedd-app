import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoadFileService {

  constructor(public http: HttpClient) { }

  public loadFile(nameOfFile) {
    return this.http.get('/assets/' + nameOfFile, { responseType: 'text' }).pipe(
      take(1)
    ).toPromise();
  }

  public loadJson(nameOfFile) {
    return this.http.get('/assets/' + nameOfFile, { responseType: 'json' }).pipe(
      take(1)
    ).toPromise();
  }

  public loadSQl(nameOfFile) {
    return this.http.get('/assets/' + nameOfFile, { responseType: 'text' });
  }
}


