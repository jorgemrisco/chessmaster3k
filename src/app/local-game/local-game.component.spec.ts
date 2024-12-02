import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGameComponent } from './local-game.component';
import { FormsModule } from '@angular/forms';
import { MessageType } from '../services/chess-message/message.model';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

describe('LocalGameComponent', () => {
  const GAME_START_FEN =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  let component: LocalGameComponent;
  let fixture: ComponentFixture<LocalGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalGameComponent, MenuBarComponent],
      imports: [FormsModule],
    });

    fixture = TestBed.createComponent(LocalGameComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should restart game', () => {
    component.currentFen = 'Ongoing match fen example';

    component.resetGame();

    expect(component.currentFen).toBe(GAME_START_FEN);
  });

  it('should clear game state', () => {
    localStorage.setItem('gameState', 'gamestateinfo');
    expect(localStorage.getItem('gameState')).toBe('gamestateinfo');

    component['clearGameState']();
    const response = localStorage.getItem('gameState');

    expect(response).toBeNull();
  });

  it('should handle incoming message', () => {
    const message = {
      data: {
        fen: 'r4Bk1/qbR3pp/pn2p3/1p3p1Q/4P3/6P1/PP3PBP/5RK1 b - - 0 23',
        type: MessageType.MOVE,
      },
    };

    component['handleMessage'](message as MessageEvent);

    expect(component.currentFen).toBe(message.data.fen);
    expect(localStorage.getItem('gameState')).toBe(message.data.fen);
  });
});
