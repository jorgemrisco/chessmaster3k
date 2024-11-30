import { Injectable } from '@angular/core';
import { ChessMessage, MessageType } from '../board/board.model';

@Injectable({
  providedIn: 'root',
})
export class ChessMessageService {
  // Send a message to a target window (e.g., iframe)
  sendMessage(targetWindow: Window | null, message: ChessMessage): void {
    if (targetWindow) {
      targetWindow.postMessage(message, '*');
    }
  }

  // Parse and validate a received message
  parseMessage(event: MessageEvent): ChessMessage {
    return event.data as ChessMessage;
  }
}
