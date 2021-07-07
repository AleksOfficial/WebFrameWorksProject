import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      street: [''],
      city: [''],
      postcode: ['', Validators.pattern("[0-9]+")],

    }, {
      validator: MustMatch("password", "passwordConfirm")
    }
  );
  hide = true;
  isLoading = false;
  noMatch = false;
  httpOptions = {
    headers: new HttpHeaders({ "content-type":"application/json" })
  };

  getPasswordErrorMessage() {
    return this.registerForm.get("password")!.hasError('required') ? 'You must enter a password' : '';
  }

  getPasswordConfirmErrorMessage() {
    if (this.registerForm.get("passwordConfirm")!.hasError('mustMatch')) {
      return "Passwords must match";
    }
    return this.registerForm.get("passwordConfirm")!.hasError('required') ? 'You must confirm your password' : '';
  }

  getEmailErrorMessage() {
    if (this.registerForm.get("email")!.hasError('required')) {
      return 'You must enter a valid email adress';
    }

    return this.registerForm.get("email")!.hasError('email') ? 'Not a valid email address' : '';
  }

  getPostcodeErrorMessage() {
    return this.registerForm.get("postcode")!.hasError("pattern") ? "Enter valid postal code (numbers only)" : "";
  }

  onSubmit() {
    if (this.getEmailErrorMessage() == ''
        && this.getPasswordConfirmErrorMessage() == ''
        && this.getPasswordErrorMessage() == ''
        && this.getPostcodeErrorMessage() == '') {
      this.http.post<{ message: string, token: string }>("http://localhost:3000/signup", {
        email: this.registerForm.get("email")!.value,
        password: this.registerForm.get("password")!.value,
        street: this.registerForm.get("street")!.value,
        city: this.registerForm.get("city")!.value,
        postcode: this.registerForm.get("postcode")!.value
      }, this.httpOptions).subscribe({
        next: (responseData) => {
            this.openSnackBar(responseData.message, 3000);
            localStorage.setItem("authenticationToken", responseData.token);
            localStorage.setItem("email", this.registerForm.get("email")!.value);
            this.router.navigate(["/supersecretprivateuserspace"]);
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

  constructor(private formBuilder: FormBuilder, 
              private http: HttpClient,
              private snackBar: MatSnackBar,
              private router: Router) { 
   }

  ngOnInit(): void {
  }

}
