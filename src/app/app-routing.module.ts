import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighscoresComponent } from './highscores/highscores.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserSpaceComponent } from './user-space/user-space.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "supersecretprivateuserspace", component: UserSpaceComponent },
  { path: "highscores", component: HighscoresComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
