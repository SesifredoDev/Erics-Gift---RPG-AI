import { Component, OnInit } from '@angular/core';
import { GameService } from './shared/services/game.service';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public appPages = [
    { title: 'Game', url: '/home', icon: 'game-controller' },
    { title: 'Inventory', url: '/inventory', icon: 'construct' },
  ];
  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.intialiseGame();
    
  }
  
}
