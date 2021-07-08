import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Game, Tile } from './classes';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" })
  };

  paths: string[] = [];
  basepath: "puzzle1/" | "puzzle2/" = "puzzle1/";
  game: Game = new Game();
  choice1: number = -1;
  started: boolean = false;
  hundreths: number = 0;
  seconds: number = 0;
  minutes: number = 0;
  timeFunction: any;
  puzzle: 1 | 2 = 1;

  constructor(private _auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    for (let i = 1; i <= 9; i++) {
      this.paths[i-1] = this.basepath + "img" + i + ".jpg";
    }
  }

  start() {
    this.hundreths = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.game.shuffle();
    this.updatePaths();
    this.started = true;
    //clock
    this.timeFunction = setInterval(()=>{
      this.hundreths += 20;
      if (this.hundreths % 100 == 0) {
        this.hundreths = 0;
        this.seconds++;
        if (this.seconds % 60 == 0) {
          this.seconds = 0;
          this.minutes++;
        }
      }
    }, 200);
  }

  //update image-paths according to games state
  updatePaths() {
    let tiles = this.game.getTiles();
    for (let i = 0; i < 9; i++) {
      this.paths[i] = this.basepath + "img" + tiles[i].getID() + ".jpg";
    }
    //stop timer and send highscore if game is won
    if (this.started && this.game.checkForWin()) {
      this.started = false;
      clearInterval(this.timeFunction);
      let score: number = 100 - (this.hundreths / 100) - this.seconds - (this.minutes * 60);
      this.addHighscore(score > 0 ? score : 0, this.puzzle);
    }
  }

  addHighscore(highScore: number, puzzle: number) {
      this.http.post<{ message: string }>("http://localhost:3000/highscore", {
        email: localStorage.getItem("email"),
        currentToken: localStorage.getItem("authenticationToken"),
        highScore: highScore,
        puzzle: puzzle
      }, this.httpOptions).subscribe({
        next: (responseData) => {
            this._auth.openSnackBar(responseData.message, 3000);
          },
        error: (err) => {
          this._auth.openSnackBar("Could not save Highscore. Please Sign up or log in to save your highscores!", 3000);
        }
      });
  }

  clickImage(n: number, event: MouseEvent) {
    if (!this.started) {
      return;
    }
    if (this.choice1 < 0) {
      this.choice1 = n;
      (event.target as Element).classList.add("selected");
    } else {
      document.getElementById(this.choice1.toString())!.classList.remove("selected");
      this.game.swapTiles(this.choice1, n);
      this.updatePaths();
      this.choice1 = -1;
    }
  }

  //changes basepath to load different images
  changePuzzle(n: 1 | 2) {
    this.puzzle = n;
    if (n == 1) {
      this.basepath = 'puzzle1/';
    } else {
      this.basepath = 'puzzle2/';
    }
    this.updatePaths();
  }
}
