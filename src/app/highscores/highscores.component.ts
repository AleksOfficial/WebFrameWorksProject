import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})
export class HighscoresComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" }),
    params: new HttpParams()
  };
  highScores: any[] = [];
  isLoading: boolean = false;

  getHighScores() {
      let email = localStorage.getItem("email")!;
      let token = localStorage.getItem("authenticationToken")!;
      console.log(email + " " + token);
      this.http.get<{ highScores: any[] }>("http://localhost:3000/highscore?email=" + email + "&token=" + token, this.httpOptions)
          .subscribe({
            next: (responseData) => {
              console.log(responseData);
              this.highScores = responseData.highScores;

            },
            error: (err)=> {
              console.log(err);
            }
          });
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void { 
    this.getHighScores();
   }

}
