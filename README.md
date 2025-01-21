# Chessmaster3k

live demo: https://chessmaster3k-1dd85.web.app/mainpage


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

_This project was generated with Angular CLI version 16.2.16._

Study project with the goal to practice interaction between iFrames on Angular16

---

- Inside each iFrame a simple chess board is rendered using the following library [https://www.npmjs.com/package/ngx-chess-board](https://www.npmjs.com/package/ngx-chess-board) 
  - Using v2.2.3 and installing with --force due to some incompatibilites with angular16

## Primary goal

1. Simulate a chess match where each iFrame represents a player;
2. When a user looking at the main page moves a piece in the board in iframe1, the move should be duplicated in the corresponding piece in the board in iframe2. Similarly, when a piece is moved in board in iframe2 corresponding piece in iframe1 should be automatically moved.
3. This communication should happen only via the main page as below.
   1. Move piece in iframe1 -> capture event -> send to parent, i.e main page -> process in the main page, send to iframe2 -> receive in iframe2 and update board accordingly.
4. The communication defined above should happen via the postMessage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

---

## Game State


- Requirement 1 - The second board should be rotated so that the black is facing the player
- Requirement 2 - When it’s the white turn, make sure the second board is disabled, and when it’s the black turn, make sure the first board is disabled. This simulates an actual game where the white player cannot make a black move and the other way around.
- Requirement 3 - Detect a checkmate and present an alert on the screen to announce the game end, the user can click “Create new game” to reset the board
- Requirement 4 - If the user closes the browser before the game ends, use LocalStorage to store the current game state and load that state when the user opens the page later so that the user can resume the previous unfinished game.

As part of the challenge, `LocalStorage` is not used for communicating between the parent window and the iFrames, the communication should use the postMessage API.

## Online Games

- Implemented using firebase realtime database
- User can create a new game and invite a friend with a gamecode