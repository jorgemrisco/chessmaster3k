import { Injectable } from '@angular/core';
import { Fen } from './fen.model';

@Injectable({
  providedIn: 'root',
})
export class FenParserService {
  constructor() {}

  public GAME_START_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  isValidFEN(fen: string): boolean {
    const parts = fen.split(' ');

    // 1. Check the number of fields
    if (parts.length !== 6) return false;

    const game: Fen = {
      position: parts[0],
      activeColor: parts[1],
      castling: parts[2],
      enPassant: parts[3],
      halfmoveClock: parts[4],
      fullmoveNumber: parts[5],
    };

    // 2. Validate piece placement
    const rows = game.position.split('/');
    if (rows.length !== 8) return false;

    for (const row of rows) {
      let squareCount = 0;

      for (const char of row) {
        if ('12345678'.includes(char)) {
          squareCount += parseInt(char, 10);
        } else if ('rnbqkpRNBQKP'.includes(char)) {
          squareCount += 1;
        } else {
          return false; // Invalid character
        }
      }

      if (squareCount !== 8) return false; // Each row must have exactly 8 squares
    }

    // 3. Validate active color
    if (!['w', 'b'].includes(game.activeColor)) return false;

    // 4. Validate castling availability
    if (!/^[KQkq\-]+$/.test(game.castling)) return false;

    // 5. Validate en passant target
    if (!/^(-|[a-h][36])$/.test(game.enPassant)) return false;

    // 6. Validate halfmove clock
    if (isNaN(Number(game.halfmoveClock)) || Number(game.halfmoveClock) < 0)
      return false;

    // 7. Validate fullmove number
    if (isNaN(Number(game.fullmoveNumber)) || Number(game.fullmoveNumber) <= 0)
      return false;

    return true;
  }
}
