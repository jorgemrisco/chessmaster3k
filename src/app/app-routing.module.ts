import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalGameComponent } from './local-game/local-game.component';
import { BoardComponent } from './board/board.component';
import { OnlineGameComponent } from './online-game/online-game.component';

const routes: Routes = [
  { path: 'mainpage', component: LocalGameComponent }, // Main page route
  { path: 'iframepage', component: BoardComponent }, // Iframe page route
  { path: 'online-game', component: OnlineGameComponent },
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: '**', redirectTo: '/mainpage' }, // Fallback for invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
