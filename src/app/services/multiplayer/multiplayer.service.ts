import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as uuid from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class MultiplayerService {
  constructor(private db: AngularFireDatabase) {}

  createGame(playerName: string) {
    const player1 = playerName;
    const player2 = 'black';
    const gameCode = this.generateGameCode();
    const gameRef = this.db.object('games/' + gameCode);

    gameRef.set({
      players: {
        player1,
        player2,
      },
      boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Default start state (FEN)
      gameStatus: 'ongoing',
      gameCode,
    });

    return gameCode;
  }

  async joinGame(gamecode: string, playerName: string): Promise<any> {
    const gameRef = this.db.object('games/' + gamecode);

    await gameRef.update({
      players: { player2: playerName },
      gameStatus: 'ongoing',
    });

    return gameRef.valueChanges();
  }

  generateGameCode() {
    return uuid.v7();
  }

  listenToGameState(gameCode: string) {
    const gameRef = this.db.object('games/' + gameCode);

    return gameRef.valueChanges();
  }
}
