import { Component, OnInit } from '@angular/core';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  inventory: any[] = [];;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.inventory = this.gameService.getCurrentInventory();
    this.gameService.getInventory().subscribe((inventory) => {
      this.inventory = inventory;
      
    });
    this.gameService.initInventory();

  }
}
