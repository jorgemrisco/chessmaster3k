import { TestBed } from '@angular/core/testing';
import { ChessMessageService } from './chess-message.service';
import { ChessMessage, MessageType } from './message.model';

describe('ChessMessageService', () => {
  let service: ChessMessageService;
  let mockWindow: jasmine.SpyObj<Window>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChessMessageService],
    });
    service = TestBed.inject(ChessMessageService);

    // Create a mock for Window object
    mockWindow = jasmine.createSpyObj('Window', ['postMessage']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMessage', () => {
    it('should send a message to the target window', () => {
      const message: ChessMessage = {
        type: MessageType.MOVE,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      };

      service.sendMessage(mockWindow, message);

      expect(mockWindow.postMessage).toHaveBeenCalledWith(message);
    });

    it('should not call postMessage if the targetWindow is null', () => {
      const message: ChessMessage = {
        type: MessageType.MOVE,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      };

      service.sendMessage(null, message);

      expect(mockWindow.postMessage).not.toHaveBeenCalled();
    });
  });

  describe('parseMessage', () => {
    it('should parse a message event and return the message data', () => {
      const mockEvent = {
        data: {
          type: MessageType.UPDATE,
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        },
        origin: '',
        source: null,
      };

      const result = service.parseMessage(mockEvent as MessageEvent);

      expect(result).toEqual(mockEvent.data);
    });
  });

  describe('isItWhitePlayerTurn', () => {
    it("should return true if it is white player's turn", () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const result = service.isItWhitePlayerTurn(fen);

      expect(result).toBeTrue();
    });

    it("should return false if it is black player's turn", () => {
      const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
      const result = service.isItWhitePlayerTurn(fen);

      expect(result).toBeFalse();
    });

    it('should handle invalid FEN format gracefully', () => {
      const invalidFen = 'invalid-fen-string';
      const result = service.isItWhitePlayerTurn(invalidFen);

      expect(result).toBeFalse(); // It would return false since the check is done on the second field
    });
  });
});
