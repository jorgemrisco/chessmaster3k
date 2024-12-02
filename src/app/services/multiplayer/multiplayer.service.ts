import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { GameData } from './multiplayer.model';
@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  constructor(private db: AngularFireDatabase) {}

  createGame(playerName: string) {
    const white = playerName;
    const black = 'black';
    const gameCode = this.generateGameCode();
    const gameRef: AngularFireObject<GameData> = this.db.object(
      'games/' + gameCode
    );

    gameRef.set({
      players: {
        white,
        black,
      },
      boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Default start state (FEN)
      gameStatus: 'ONGOING',
      gameCode,
    });

    return gameRef.valueChanges();
  }

  async joinGame(gamecode: string, playerName: string) {
    const gameRef: AngularFireObject<GameData> = this.db.object(
      'games/' + gamecode
    );

    gameRef.valueChanges().subscribe(async (game) => {
      await gameRef.update(<Partial<GameData>>{
        players: { black: playerName, white: game?.players.white },
      });
    });

    return gameRef.valueChanges();
  }

  generateGameCode() {
    return uuid.v7();
  }

  getGameInfo(gameCode: string): Observable<GameData | null> {
    const gameRef: AngularFireObject<GameData> = this.db.object(
      'games/' + gameCode
    );

    return gameRef.valueChanges();
  }

  async updateFen(fen: string, gamecode: string) {
    const gameRef: AngularFireObject<GameData> = this.db.object(
      'games/' + gamecode
    );

    await gameRef.update(<Partial<GameData>>{
      boardState: fen,
    });

    return gameRef.valueChanges();
  }
}
