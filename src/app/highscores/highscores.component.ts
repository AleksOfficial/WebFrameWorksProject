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
  isLoading: boolean = true;
  puzzle: 1 | 2 = 1;
  highScoresPuzzle1: any[] = [];
  highScoresPuzzle2: any[] = [];

  getHighScores() {
    this.http.get<{ highScores: any[] }>("http://localhost:3000/highscore?puzzle=1", this.httpOptions)
        .subscribe({
          next: (responseData) => {
            this.highScores = responseData.highScores;
            this.highScoresPuzzle1 = this.highScores;

          },
          error: (err)=> {
            console.log(err);
          }
        });
        this.http.get<{ highScores: any[] }>("http://localhost:3000/highscore?puzzle=2", this.httpOptions)
            .subscribe({
              next: (responseData) => {
                this.highScoresPuzzle2 = responseData.highScores;
                this.isLoading = false;
  
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

   changePuzzle(n: 1 | 2) {
    this.puzzle = n;
    if (n == 1) {
      this.highScores = this.highScoresPuzzle1;
    } else {
      this.highScores = this.highScoresPuzzle2;
    }
  }
}
