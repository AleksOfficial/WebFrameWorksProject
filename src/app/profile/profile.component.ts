import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" }),
    params: new HttpParams()
  };
  email: string = "";
  street: string = "unknown";
  city: string = "unknown";
  postcode: string = "unknown";
  highestScore: string = "unknown";
  isLoggedIn = false;

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
              this.getProfileData();
            }
          },
        error: (err) => {
          this.isLoggedIn = false;
        }
      });
    }
  }

  getProfileData() {
    if (this.isLoggedIn) {
      let email = localStorage.getItem("email")!;
      let token = localStorage.getItem("authenticationToken")!;
      this.http.get<{ highScores: any[] }>("http://localhost:3000/getUserData?email=" + email + "&token=" + token, this.httpOptions)
          .subscribe({
            next: (responseData) => {
              console.log(responseData);
            },
            error: (err)=> {
              console.log(err);
            }
          });
    }
  }

}
