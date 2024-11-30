import { TestBed } from '@angular/core/testing';

import { ChessMessageService } from './chess-message.service';

describe('ChessMessageService', () => {
  let service: ChessMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
