import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public _auth: AuthService, private _http: HttpClient) {}

  loggedIn: boolean = false;

  ngOnInit(): void { }

}
