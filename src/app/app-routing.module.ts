import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { HighscoresComponent } from './highscores/highscores.component';

import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: "", component: PuzzleComponent},
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "highscores", component: HighscoresComponent},
  { path: "profile", component: ProfileComponent},
  { path: "faq", component: FaqComponent},
  { path: "404", component: PageNotFoundComponent},
  { path: "**", redirectTo: "/404"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
