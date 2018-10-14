import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadFileService {

  constructor(private http: HttpClient) { }

  public loadTsv(nameOfFile) {
    console.log("LOADING")
    return this.http.get("/assets/" + nameOfFile, {responseType: "text"}).pipe(
      take(1)
    ).toPromise();
  }
}

