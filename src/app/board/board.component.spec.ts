import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { FormsModule } from '@angular/forms';
import { NgxChessBoardModule, NgxChessBoardView } from 'ngx-chess-board'; // Import the correct module for ngx-chess-board
import { ChessMessageService } from '../services/chess-message/chess-message.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Keep this for custom elements

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let chessMessageServiceMock: jasmine.SpyObj<ChessMessageService>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
  let mockBoard: jasmine.SpyObj<NgxChessBoardView>;

  const mockFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  beforeEach(() => {
    // Mock services
    chessMessageServiceMock = jasmine.createSpyObj('ChessMessageService', [
      'sendMessage',
      'isItWhitePlayerTurn',
    ]);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', [
      'queryParams',
    ]);

    // Mocking NgxChessBoardView methods
    mockBoard = jasmine.createSpyObj('NgxChessBoardView', [
      'reverse',
      'setFEN',
      'getFEN',
      'getMoveHistory',
    ]);

    // Configuring the TestBed for testing BoardComponent
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      imports: [FormsModule, NgxChessBoardModule], // Ensure NgxChessBoardModule is imported here
      providers: [
        { provide: ChessMessageService, useValue: chessMessageServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    // Creating the component and setting up the mock references
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;

    component.board = mockBoard; // Mock the board reference
    activatedRouteMock.queryParams = of({ isBlack: 'true' }); // Mock the queryParams to simulate 'isBlack' route parameter

    fixture.detectChanges(); // Trigger Angular change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isBlack from queryParams in ngOnInit', () => {
    component.ngOnInit();
    expect(component.isBlack).toBeTrue(); // 'isBlack' should be true from the queryParams
  });

  it('should not send MOVE message on onMove if it is not my turn', () => {
    component.isMyTurn = false; // Set that it's not the player's turn
    component.onMove(); // Call onMove

    expect(chessMessageServiceMock.sendMessage).not.toHaveBeenCalled(); // Ensure sendMessage is not called
  });

  it('should toggle isMyTurn correctly based on FEN', () => {
    chessMessageServiceMock.isItWhitePlayerTurn.and.returnValue(true); // Simulate the service returning true (white's turn)
    component.isBlack = true; // Set that it's the black player's turn

    component['toggleBoard'](mockFEN); // Call toggleBoard with the mock FEN

    expect(component.isMyTurn).toBeFalse(); // Black's turn, so isMyTurn should be false
  });
});
