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
  isLoading = false;
  isLoggedIn: boolean = false;
  highScores: any[] = [];

  getHighScores() {
    if (this.isLoggedIn) {
      let email = localStorage.getItem("email")!;
      let token = localStorage.getItem("authenticationToken")!;
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
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    if (email != null && token != null) {
      this.http.get<{ valid: boolean }>("http://localhost:3000/checklogin?email=" + email + "&token=" + token, 
            this.httpOptions).subscribe({
        next: (responseData) => {
            if (responseData.valid) {
              this.isLoggedIn = true;
              this.httpOptions.params.append("email", localStorage.getItem("email")!);
              this.httpOptions.params.append("currentToken", localStorage.getItem("authenticationToken")!);
              this.getHighScores();
            }
          },
        error: (err) => {
          this.isLoggedIn = false;
        }
      });
    }
    if (this.isLoggedIn) {
    }
  }

}
