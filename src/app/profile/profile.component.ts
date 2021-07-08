import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

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
  dataLoaded = false;
  highscoreLoaded = false;

  constructor(private http: HttpClient, public _auth: AuthService) { }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    if (this._auth.loggedIn) {
      let email = localStorage.getItem("email")!;
      let token = localStorage.getItem("authenticationToken")!;
      //get profile data
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
              this.dataLoaded = true;
            },
            error: (err)=> {
              console.log(err);
            }
          });
      //get highest highscore
      this.http.get<{ 
        email: string,
        value: number
       }>("http://localhost:3000/getHighscore?email=" + email + "&token=" + token, this.httpOptions)
          .subscribe({
            next: (responseData) => {
              this.highestScore = responseData.value.toString();
              this.highscoreLoaded = true;
            },
            error: (err)=> {
              console.log(err);
            }
          });
    }
  }

}
