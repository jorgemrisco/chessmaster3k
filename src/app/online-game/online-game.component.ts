import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MultiplayerService } from '../services/multiplayer/multiplayer.service';
import { ChessMessageService } from '../services/chess-message/chess-message.service';
import { FenParserService } from '../services/fen-parser/fen-parser.service';
import { GameData } from '../services/multiplayer/multiplayer.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ChessMessage,
  MessageType,
} from '../services/chess-message/message.model';

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.scss'],
})
export class OnlineGameComponent implements OnInit, OnDestroy {
  @ViewChild('boardIframe') boardIframe!: ElementRef<HTMLIFrameElement>;

  gameCode: string = '';
  isBlack = false;
  iframeUrl: SafeResourceUrl = ''; // Will be dynamically updated
  playerName: string = '';
  isGameCreated = false;
  gameData: GameData = {
    boardState: '',
    gameCode: '',
    gameStatus: 'WAITING',
    players: {
      black: 'black',
      white: 'white',
    },
  };
  currentFen = '';
  gameInfoInterval?: any;

  constructor(
    private multiplayerService: MultiplayerService,
    private chessMessageService: ChessMessageService,
    private fenParserService: FenParserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentFen = this.fenParserService.GAME_START_FEN;
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  ngOnDestroy(): void {
    if (this.gameInfoInterval) {
      clearInterval(this.gameInfoInterval); // Clear the interval on component destroy to avoid memory leaks
    }
  }

  createGame() {
    if (this.playerName.trim()) {
      const gameRef = this.multiplayerService.createGame(
        this.playerName.trim()
      );
      gameRef.subscribe((values) => {
        if (values?.gameCode) {
          this.gameCode = values.gameCode;
          this.isGameCreated = true;
          this.isBlack = false;
          this.gameData = values;
          this.cdr.detectChanges();
          this.startGameInfoPolling();
        }
      });
    } else {
      alert('Please enter a player name.');
    }
  }

  joinGame() {
    if (this.playerName.trim() && this.gameCode.trim()) {
      this.multiplayerService
        .joinGame(this.gameCode, this.playerName)
        .then((game) => {
          game.subscribe((game) => {
            this.gameData = game!;
            this.isBlack = true;
            this.isGameCreated = true;
            this.cdr.detectChanges();
            this.startGameInfoPolling();
          });
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      alert('Please enter a player name and game code.');
    }
  }

  private startGameInfoPolling() {
    this.gameInfoInterval = setInterval(() => {
      this.multiplayerService.getGameInfo(this.gameCode).subscribe((game) => {
        if (game?.boardState !== this.currentFen) {
          this.currentFen = game?.boardState!;
          this.gameCode = game?.gameCode!;
          this.gameData = game!;

          this.chessMessageService.sendMessage(
            this.boardIframe.nativeElement.contentWindow,
            {
              fen: this.currentFen,
              type: MessageType.UPDATE,
            }
          );
        }
      });
    }, 500); // Periodically fetch game data every 500ms
  }

  // Update iframe URL using DomSanitizer to avoid XSS errors

  private handleMessage(event: MessageEvent<ChessMessage>) {
    this.checkForMate(event.data);

    const message = this.chessMessageService.parseMessage(event);
    if (message.type === MessageType.MOVE) {
      this.currentFen = message.fen;
      this.multiplayerService.updateFen(this.currentFen, this.gameCode);
    }
  }

  private checkForMate(message: ChessMessage): boolean {
    if (message.isMate) {
      alert(`Checkmate!`);
      return true;
    }
    return false;
  }
}
