export interface GameData {
  boardState: string;
  gameCode: string;
  gameStatus: 'ONGOING' | 'FINISHED' | 'WAITING';
  players: {
    white: string;
    black: string;
  };
}
