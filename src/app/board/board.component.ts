import { Component } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  onMove(event: any) {
    console.log('Move made:', event); // Log the event for now
  }
}
