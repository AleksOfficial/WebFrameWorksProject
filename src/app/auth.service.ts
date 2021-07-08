import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, 
              private _snackBar: MatSnackBar,
              private _router: Router) {
    this.ngOnInit();
  }

  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" }),
    params: new HttpParams()
  };
  loggedIn: boolean = false;

  ngOnInit(): void {
    this.loggedIn = false;
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    if (email != null && token != null) {
      this._http.get<{ valid: boolean }>("http://localhost:3000/checklogin?email=" + email + "&token=" + token, 
                    this.httpOptions).subscribe({
          next: (responseData) => {
              console.log(responseData);
              if (responseData.valid) {
                this.loggedIn = true;
              }
            },
          error: (err) => {
            this.loggedIn = false;
          }
      });
    }
  }

  
  logout() {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    this._http.delete<{ message: string }>("http://localhost:3000/logout?email=" + email + "&token=" + token, 
            this.httpOptions).subscribe({
              next: (responseData)=> {
                this.openSnackBar(responseData.message, 3000);
                localStorage.clear();
                this.ngOnInit();
                this._router.navigate(['/']);
              },
              error: (err)=> {
                this.openSnackBar(err.error.message, 3000);
              }
            });
          }

  openSnackBar(message: string, duration: number) {
    this._snackBar.open(message, '', { duration: duration });
  }
}
