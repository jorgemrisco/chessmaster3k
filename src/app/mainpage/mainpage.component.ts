import { Component, OnInit } from '@angular/core';
import { ChessMessageService } from '../services/chess-message.service';
import { MessageType } from '../services/message.model';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
})
export class MainpageComponent implements OnInit {
  private whiteBoard!: HTMLIFrameElement;
  private blackBoard!: HTMLIFrameElement;
  customFen = '';
  isWhiteTurn = true;
  private gameStartFen =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  currentFen = '';

  constructor(private chessMessageService: ChessMessageService) {
    this.currentFen = this.gameStartFen;
  }

  ngOnInit(): void {
    this.whiteBoard = document.getElementById(
      'whiteBoard'
    ) as HTMLIFrameElement;
    this.blackBoard = document.getElementById(
      'blackBoard'
    ) as HTMLIFrameElement;

    // Listen for messages from the iframes
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * As a parent, receives the MOVE Message and sends an UPDATE message to the other board
   * @param event
   */
  handleMessage(event: MessageEvent) {
    const message = this.chessMessageService.parseMessage(event);
    if (message.type === MessageType.MOVE) {
      const target =
        event.source === this.whiteBoard?.contentWindow
          ? this.blackBoard
          : this.whiteBoard;

      this.chessMessageService.sendMessage(target?.contentWindow, {
        fen: message.fen,
        type: MessageType.UPDATE,
      });

      this.currentFen = message.fen;
      this.finishTurn();
    }
  }

  private finishTurn() {
    this.isWhiteTurn = !this.isWhiteTurn;
  }

  resetGame() {
    this.chessMessageService.sendMessage(this.whiteBoard?.contentWindow, {
      type: MessageType.UPDATE,
      fen: this.gameStartFen,
    });

    this.chessMessageService.sendMessage(this.blackBoard?.contentWindow, {
      type: MessageType.UPDATE,
      fen: this.gameStartFen,
    });

    this.currentFen = this.gameStartFen;
  }

  setCustomFEN(): void {
    if (this.isValidFEN(this.customFen)) {
      // Send the FEN to both boards
      this.whiteBoard?.contentWindow?.postMessage(
        { type: 'UPDATE', fen: this.customFen },
        '*'
      );
      this.blackBoard?.contentWindow?.postMessage(
        { type: 'UPDATE', fen: this.customFen },
        '*'
      );
      console.log('Custom FEN set:', this.customFen);
    } else {
      alert('Invalid FEN. Please enter a valid FEN string.');
    }
  }

  isValidFEN(fen: string): boolean {
    const parts = fen.split(' ');

    // 1. Check the number of fields
    if (parts.length !== 6) return false;

    const [
      position,
      activeColor,
      castling,
      enPassant,
      halfmoveClock,
      fullmoveNumber,
    ] = parts;

    // 2. Validate piece placement
    const rows = position.split('/');
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
    if (!['w', 'b'].includes(activeColor)) return false;

    // 4. Validate castling availability
    if (!/^[KQkq\-]+$/.test(castling)) return false;

    // 5. Validate en passant target
    if (!/^(-|[a-h][36])$/.test(enPassant)) return false;

    // 6. Validate halfmove clock
    if (isNaN(Number(halfmoveClock)) || Number(halfmoveClock) < 0) return false;

    // 7. Validate fullmove number
    if (isNaN(Number(fullmoveNumber)) || Number(fullmoveNumber) <= 0)
      return false;

    return true;
  }
}
