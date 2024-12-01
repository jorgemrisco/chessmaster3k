import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChessMessageService } from '../services/chess-message/chess-message.service';
import {
  ChessMessage,
  MessageType,
} from '../services/chess-message/message.model';
import { FenParserService } from '../services/fen-parser/fen-parser.service';

@Component({
  selector: 'local-game',
  templateUrl: './local-game.component.html',
  styleUrls: ['./local-game.component.scss'],
})
export class LocalGameComponent implements OnInit {
  private whiteBoard!: HTMLIFrameElement;
  private blackBoard!: HTMLIFrameElement;
  customFenButtonInput = '';
  isWhiteTurn = true;

  currentFen = '';

  constructor(
    private chessMessageService: ChessMessageService,
    private fenParserService: FenParserService
  ) {}

  ngOnInit(): void {
    this.currentFen = this.getStartingFen();
    this.whiteBoard = document.getElementById(
      'whiteBoard'
    ) as HTMLIFrameElement;
    this.blackBoard = document.getElementById(
      'blackBoard'
    ) as HTMLIFrameElement;

    // Attach load event listeners
    this.restoreSavedGame();

    // Listen for messages from the iframes
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * As a parent, receives the MOVE Message and sends an UPDATE message to the other board
   * @param event
   */

  resetGame() {
    this.chessMessageService.sendMessage(this.whiteBoard?.contentWindow, {
      type: MessageType.UPDATE,
      fen: this.fenParserService.GAME_START_FEN,
    });

    this.chessMessageService.sendMessage(this.blackBoard?.contentWindow, {
      type: MessageType.UPDATE,
      fen: this.fenParserService.GAME_START_FEN,
    });

    this.currentFen = this.fenParserService.GAME_START_FEN;
    this.clearGameState();
  }

  setCustomFEN(fen?: string): void {
    if (this.fenParserService.isValidFEN(fen ?? this.customFenButtonInput)) {
      // Send the FEN to both boards
      this.whiteBoard?.contentWindow?.postMessage(
        { type: 'UPDATE', fen: fen ?? this.customFenButtonInput },
        '*'
      );
      this.blackBoard?.contentWindow?.postMessage(
        { type: 'UPDATE', fen: fen ?? this.customFenButtonInput },
        '*'
      );
    } else {
      console.log('invalid');
      alert('Invalid FEN. Please enter a valid FEN string.');
    }
  }

  private handleMessage(event: MessageEvent) {
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
      this.saveGameState(this.currentFen);
      if (!this.checkForMate(message)) {
        this.finishTurn();
      }
    }
  }

  private saveGameState(fen: string) {
    localStorage.setItem('gameState', fen);
  }

  private getStartingFen(): string {
    const localStorageFen = localStorage.getItem('gameState');
    return localStorageFen
      ? localStorageFen
      : this.fenParserService.GAME_START_FEN;
  }

  private clearGameState() {
    localStorage.removeItem('gameState');
  }

  private finishTurn() {
    this.isWhiteTurn = !this.isWhiteTurn;
  }

  private checkForMate(message: ChessMessage): boolean {
    if (message.isMate) {
      const winner = this.isWhiteTurn ? 'White' : 'Black';
      alert(`Checkmate! ${winner} won.`);
      this.resetGame();

      return true;
    }

    return false;
  }

  private restoreSavedGame() {
    this.whiteBoard?.addEventListener('load', () =>
      this.blackBoard?.addEventListener('load', () =>
        this.setCustomFEN(this.currentFen)
      )
    );
  }
}
