import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocalGameComponent } from './local-game/local-game.component';
import { BoardComponent } from './board/board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, LocalGameComponent, BoardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
