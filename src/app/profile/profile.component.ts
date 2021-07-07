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
  isLoading = true;

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
              this.isLoading = false;
              this.httpOptions.params.append("email", localStorage.getItem("email")!);
              this.httpOptions.params.append("currentToken", localStorage.getItem("authenticationToken")!);
              this.getProfileData();
            }
          },
        error: (err) => {
          this.isLoggedIn = false;
          this.isLoading = false;
        }
      });
    }
  }

  getProfileData() {
    if (this.isLoggedIn) {
      let email = localStorage.getItem("email")!;
      let token = localStorage.getItem("authenticationToken")!;
      this.http.get<{ 
        email: string,
        street: string,
        city: string,
        postcode: string
       }>("http://localhost:3000/getUserData?email=" + email + "&token=" + token, this.httpOptions)
          .subscribe({
            next: (responseData) => {
              this.email = responseData.email;
              this.street = responseData.street != "" ? responseData.street : "unknown";
              this.city = responseData.city != "" ? responseData.city : "unknown";
              this.postcode = responseData.postcode != "" ? responseData.postcode : "unknown";
            },
            error: (err)=> {
              console.log(err);
            }
          });
      this.http.get<{ 
        email: string,
        value: number
       }>("http://localhost:3000/getHighscore?email=" + email + "&token=" + token, this.httpOptions)
          .subscribe({
            next: (responseData) => {
              console.log(responseData);
              this.highestScore = responseData.value.toString();
            },
            error: (err)=> {
              console.log(err);
            }
          });
    }
  }

}
