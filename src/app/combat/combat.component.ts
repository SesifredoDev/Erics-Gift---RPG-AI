import { Component, OnInit } from '@angular/core';
import { ICombat } from '../shared/modals/combat.modal';
import * as p5 from 'p5';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
})
export class CombatComponent  implements OnInit {

  constructor() { }
  combatBlock: ICombat| null = null;
  canvas: any = null;

  ngOnInit() {
    console.log(this.combatBlock)

    
    
  }

  attack(){

  }
  dodge(){

  }
  inventory(){
    
  }
  

}
