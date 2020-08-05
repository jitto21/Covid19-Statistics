import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public stateObj: string = '';
  title = 'covid19';

  sateEventHandler(event) {
    console.log(JSON.parse(event));
    this.stateObj = event;
  }
}
