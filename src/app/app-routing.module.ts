import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalGameComponent } from './local-game/local-game.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: 'mainpage', component: LocalGameComponent }, // Main page route
  { path: 'iframepage', component: BoardComponent }, // Iframe page route
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: '**', redirectTo: '/mainpage' }, // Fallback for invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
