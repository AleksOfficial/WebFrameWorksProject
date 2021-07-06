import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public _auth: AuthService) {}

  loggedIn: boolean = false;

  ngOnInit(): void {
    this.loggedIn = this._auth.isLoggedIn();
  }

  title = 'FHTW Puzzle Game';
}
