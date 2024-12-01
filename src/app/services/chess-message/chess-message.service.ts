import { Injectable } from '@angular/core';
import { ChessMessage } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class ChessMessageService {
  // Send a message to a target window (e.g., iframe)
  sendMessage(targetWindow: Window | null, message: ChessMessage): void {
    if (targetWindow) {
      targetWindow.postMessage(message);
    }
  }

  // Parse and validate a received message
  parseMessage(event: MessageEvent): ChessMessage {
    return event.data as ChessMessage;
  }

  isItWhitePlayerTurn(fen: string) {
    const fields = fen.split(' ');

    return fields[1] === 'w';
  }
}
