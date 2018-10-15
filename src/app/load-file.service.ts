import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadFileService {

  constructor(private http: HttpClient) { }

  public loadFile(nameOfFile) {
    console.log("LOADED " + nameOfFile)
    return this.http.get("/assets/" + nameOfFile, {responseType: "text"}).pipe(
      take(1)
    ).toPromise();
  }
}

