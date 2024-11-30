import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: 'mainpage', component: MainpageComponent },
  { path: 'iframepage', component: BoardComponent },
  { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
  { path: '**', redirectTo: '/mainpage' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
