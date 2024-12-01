import { Component, OnInit } from '@angular/core';
import { ChessMessageService } from '../services/chess-message/chess-message.service';
import {
  ChessMessage,
  MessageType,
} from '../services/chess-message/message.model';
import { FenParserService } from '../services/fen-parser/fen-parser.service';

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

  currentFen = '';

  constructor(
    private chessMessageService: ChessMessageService,
    private fenParserService: FenParserService
  ) {
    this.currentFen = this.fenParserService.GAME_START_FEN;
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
      if (!this.checkForMate(message)) {
        this.finishTurn();
      }
    }
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
  }

  setCustomFEN(): void {
    if (this.fenParserService.isValidFEN(this.customFen)) {
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
}
