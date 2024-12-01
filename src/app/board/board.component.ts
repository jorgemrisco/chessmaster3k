import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ChessMessage, MessageType } from '../services/message.model';
import { ChessMessageService } from '../services/chess-message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  @Input() isBlack = false;
  private isItWhitePlayerTurn = true;
  isMyTurn = true;

  constructor(
    private chessMessageService: ChessMessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.addEventListener('message', this.handleMessage.bind(this));

    this.route.queryParams.subscribe((params) => {
      this.isBlack = params['isBlack'] === 'true';
    });
  }

  ngAfterViewInit(): void {
    if (this.isBlack) {
      this.isMyTurn = false;
      this.board.reverse();
    }
  }

  /**
   * handles UPDATE received from parent, sync board state
   * @param event
   */
  handleMessage(event: MessageEvent) {
    const message: ChessMessage = event.data;

    if (message.type === MessageType.UPDATE) {
      this.board.setFEN(message.fen);
      this.toggleBoard(message.fen);

      if (this.isBlack) {
        this.board.reverse();
      }
    }
  }

  /**
   * Sends a MOVE message to the other board
   */
  onMove() {
    if (this.isMyTurn) {
      const fen = this.board.getFEN();
      const message: ChessMessage = {
        type: MessageType.MOVE,
        fen,
      };

      this.chessMessageService.sendMessage(window.parent, message);
      this.toggleBoard(message.fen);
    }
  }

  private toggleBoard(fen: string) {
    this.isItWhitePlayerTurn =
      this.chessMessageService.isItWhitePlayerTurn(fen);

    this.isMyTurn =
      (this.isBlack && !this.isItWhitePlayerTurn) ||
      (!this.isBlack && this.isItWhitePlayerTurn);
  }
}
