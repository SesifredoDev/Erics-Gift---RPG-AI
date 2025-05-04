import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../shared/services/game.service';

import DiceBox from '@3d-dice/dice-box';
import DisplayResults from '@3d-dice/dice-box';
import { ToastController } from '@ionic/angular';
import { interval } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  
    @ViewChild('diceContainer', { static: true }) diceContainer!: ElementRef<HTMLDivElement>;
    private diceBox!: any;
  inventory: any[] = [];;
  player: any;



  Display = new DisplayResults()

  

  constructor(private gameService: GameService, private toastController:  ToastController) { }

  async ngOnInit() {
    this.inventory = this.gameService.getCurrentInventory();
    this.gameService.getInventory().subscribe((inventory) => {
      this.inventory = inventory;
      
    });
    this.gameService.initInventory();
    this.player = this.gameService.getPlayer();
    console.log(this.player);

      // Initialize the DiceBox with the DOM element
      this.diceBox = new DiceBox({
        assetPath: '/assets/dice-box/',
      });


        // Wait for DiceBox to initialize
        await this.diceBox.init();
  }


  // Add this method
  getModifier(stat: number): number {
    return Math.floor((stat - 10) / 2);
  }

  rollStat(stat: number, statType:string){
    this.diceBox.roll("1d20");
    this.diceBox.onRollComplete  = async (DiceResult: any) => {
      let rollResult = DiceResult[0].value + this.getModifier(stat);
      this.gameService.addStatRoll(rollResult, statType);
      const toast = await this.toastController.create({
        message: `You rolled a ${rollResult} in ${statType}`, 
        duration: 1500,
        position:'bottom',
        color:'green',
        cssClass: ".itemAdded"
      });
  
      await toast.present();

    }

    let diceRoll =  setInterval(()=>{
      this.diceBox.clear();
      clearInterval(diceRoll);
    }, 15000)
    
  }
}
