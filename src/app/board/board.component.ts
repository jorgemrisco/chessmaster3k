import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ChessMessage, MessageType } from './board.model';
import { ChessMessageService } from '../services/chess-message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  @Input() isBlack: boolean = false;

  constructor(
    private chessMessageService: ChessMessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  /**
   * handles UPDATE received from parent, sync board state
   * @param event
   */
  handleMessage(event: MessageEvent) {
    const message: ChessMessage = event.data;

    if (message?.type === MessageType.UPDATE) {
      this.board.setFEN(message.fen);
    }
  }

  /**
   * Sends a MOVE message to the other board
   */
  onMove() {
    const fen = this.board.getFEN();
    const message: ChessMessage = {
      type: MessageType.MOVE,
      fen,
    };

    this.chessMessageService.sendMessage(window.parent, message);
  }
}
