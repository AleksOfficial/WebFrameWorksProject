import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', Validators.required);
  hide = true;
  isLoading = false;

  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" })
  };

  constructor(private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router,
              private _auth: AuthService) {}

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a password' : '';
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a valid email adress';
    }

    return this.email.hasError('email') ? 'Not a valid email address' : '';
  }

  onSubmit() {
    if (this.getPasswordErrorMessage() != '' || this.getEmailErrorMessage() != '') {
      return;
    }
    this.http.post<{ message: string, currentToken: string }>("http://localhost:3000/login", {
        email: this.email.value,
        password: this.password.value
    }, this.httpOptions).subscribe({
      next: (responseData) => {
        this._auth.openSnackBar(responseData.message, 3000);
        localStorage.setItem("authenticationToken", responseData.currentToken);
        localStorage.setItem("email", this.email.value);
        this._auth.ngOnInit();
        this.router.navigate(["/"]);
        },
      error: (err) => {
        this._auth.openSnackBar(err.error.message, 3000);
      }
    });
  }

  ngOnInit(): void {
  }

}
