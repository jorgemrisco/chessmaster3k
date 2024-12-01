import { TestBed } from '@angular/core/testing';

import { FenParserService } from './fen-parser.service';

describe('FenParserService', () => {
  let service: FenParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FenParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for valid FEN', () => {
    // games extracted from chess.com archives,
    // Bobby fischer's games https://www.chess.com/games/bobby-fischer
    const validGames = [
      'r4Bk1/qbR3pp/pn2p3/1p3p1Q/4P3/6P1/PP3PBP/5RK1 b - - 0 23',
      '1r1r2k1/p1p2p2/1n4pq/4b3/4P3/4PPPN/PPQB2KP/3R1R2 b - - 2 26',
      '1r3r1k/5pRP/3pbq2/4p3/1p2P3/1P1B4/2P3Q1/1K4R1 b - - 0 35',
      '2r5/1r1kpb2/p1pp1bp1/5n2/1PNP3p/P2K1P1P/2RBN1P1/2R5 w - - 15 46',
      '8/8/2p5/1pb1pN1k/p1p1P3/P1P2K2/1P4P1/8 w - - 5 47',
      '2b5/2r2kb1/p7/1p3pp1/1N6/1P1N4/P2R1PP1/6K1 w - - 10 40',
    ];

    validGames.forEach((game) => {
      const response = service.isValidFEN(game);

      expect(response).toBeTrue();
    });
  });

  it('should return false for invalid FENs', () => {
    const invalidGames = [
      'asdfasdf',
      'lorem ipsum',
      '2b5/2r2kb1/p7/1p3pp1/1N6/1P1N4/P2R1PP1/6K1 w - - 10 40ssss',
    ];

    invalidGames.forEach((game) => {
      const response = service.isValidFEN(game);

      expect(response).toBeFalse();
    });
  });
});
