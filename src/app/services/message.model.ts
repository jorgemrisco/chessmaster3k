/**
 * The steps are separated between MOVE and UPDATE so:
 * MOVE is only sent by boards and
 * UPDATE is only sent by the parent
 * conceptual separation of responsability.
 */
export enum MessageType {
  MOVE = 'MOVE',
  UPDATE = 'UPDATE',
}

export interface ChessMessage {
  type: MessageType;
  fen: string;
}
