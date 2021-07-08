import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { HighscoresComponent } from './highscores/highscores.component';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { SignupComponent } from './signup/signup.component';
import { UserSpaceComponent } from './user-space/user-space.component';

const routes: Routes = [
  { path: "", component: PuzzleComponent},
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "supersecretprivateuserspace", component: UserSpaceComponent },
  { path: "highscores", component: HighscoresComponent},
  { path: "profile", component: ProfileComponent},
  { path: "faq", component: FaqComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
