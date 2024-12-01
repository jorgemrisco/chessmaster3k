import { Component, OnInit } from '@angular/core';
import { ChessMessageService } from '../services/chess-message.service';
import { ChessMessage, MessageType } from '../board/board.model';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss'],
})
export class MainpageComponent implements OnInit {
  private whiteBoard!: HTMLIFrameElement;
  private blackBoard!: HTMLIFrameElement;

  constructor(private chessMessageService: ChessMessageService) {}

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

    const target =
      event.source === this.whiteBoard?.contentWindow
        ? this.blackBoard
        : this.whiteBoard;

    this.chessMessageService.sendMessage(target?.contentWindow, {
      fen: message.fen,
      type: MessageType.UPDATE,
    });
  }
}
