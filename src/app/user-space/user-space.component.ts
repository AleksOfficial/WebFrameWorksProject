import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.css']
})
export class UserSpaceComponent implements OnInit {
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" })
  };
  highScore: FormControl = new FormControl('', [Validators.required, Validators.pattern("[0-9]+")]);

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router) { }

  getHighScoreErrorMessage() {
    if (this.highScore.hasError("required")) {
      return "Please enter a number!";
    }
    return this.highScore.hasError("pattern") ? "Please enter valid number!" : "";
  }

  sendHighScore() {
    if (this.getHighScoreErrorMessage() == "") {
      this.http.post<{ message: string }>("http://localhost:3000/highscore", {
        email: localStorage.getItem("email"),
        currentToken: localStorage.getItem("authenticationToken"),
        highScore: parseInt(this.highScore.value)
      }, this.httpOptions).subscribe({
        next: (responseData) => {
            this.openSnackBar(responseData.message, 3000);
          },
        error: (err) => {
          this.openSnackBar(err.error.message, 3000);
        }
      });
    }
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, '', { duration: duration });
  }

  logout() {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    this.http.delete<{ message: string }>("http://localhost:3000/logout?email=" + email + "&token=" + token, 
            this.httpOptions).subscribe({
              next: (responseData)=> {
                this.openSnackBar(responseData.message, 3000);
                localStorage.clear();
                this.router.navigate(['/']);
              },
              error: (err)=> {
                this.openSnackBar(err.error.message, 3000);
              }
            });
  }

  ngOnInit(): void {
    //this.isLoading = true;
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    if (email != null && token != null) {
      this.http.get<{ valid: boolean }>("http://localhost:3000/checklogin?email=" + email + "&token=" + token, 
                    this.httpOptions).subscribe({
          next: (responseData) => {
              if (responseData.valid) {
                this.isLoggedIn = true;
                this.isLoading = false;
              }
            },
          error: (err) => {
            this.isLoading = false;
            this.isLoggedIn = false;
          }
      });
    }
  }

}
