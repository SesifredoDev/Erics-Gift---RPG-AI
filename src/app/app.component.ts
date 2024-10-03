import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Game', url: '/home', icon: 'game-controller' },
    { title: 'Inventory', url: '/inventory', icon: 'construct' },
  ];
  constructor() {}
}
