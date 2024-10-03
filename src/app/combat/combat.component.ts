import { Component, OnInit } from '@angular/core';
import { ICombat } from '../shared/modals/combat.modal';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
})
export class CombatComponent  implements OnInit {

  constructor() { }
  combatBlock: ICombat| null = null;

  ngOnInit() {
    console.log(this.combatBlock)
  }

}
