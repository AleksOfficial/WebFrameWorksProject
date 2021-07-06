import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" }),
    params: new HttpParams()
  };
  loggedIn: boolean = false;

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  ngOnInit(): void {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("authenticationToken");
    if (email != null && token != null) {
      this._http.get<{ valid: boolean }>("http://localhost:3000/checklogin?email=" + email + "&token=" + token, 
                    this.httpOptions).subscribe({
          next: (responseData) => {
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

}
