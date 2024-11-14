import { Component, OnInit } from '@angular/core';
import { ICombat, IEnemy } from '../shared/modals/combat.modal';
import * as p5 from 'p5';
import { GameService } from '../shared/services/game.service';
import { IItem } from '../shared/modals/item.modal';
import { OpenAIService } from '../shared/services/open-ai.service';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
})
export class CombatComponent implements OnInit {
  combatBlock?: ICombat;
  player: any = null;
  playerDescription: string = "Darryn is a lithe, wiry figure, their movements imbued with the ease and precision of someone accustomed to living in the shadows. They wear a fitted, dark leather tunic reinforced with subtle, overlapping scales for protection without sacrificing agility. A hood, often drawn low, casts a shadow over sharp features—cheekbones high and prominent, framing a pair of keen, observant eyes that glint like shards of polished steel. Their skin bears the faint, sun-kissed tone of someone often outdoors yet cloaked in shadow. A small collection of scars—a nick on the brow, a faint line across one hand—suggests experience rather than recklessness. At their side, a pair of daggers rest in worn leather sheaths, the hilts wrapped in strips of dark cloth for a surer grip. A weathered pouch hangs from their belt, hinting at hidden supplies, and their boots, soft-soled and expertly worn-in, make no sound even on the roughest ground. A faint air of mystery surrounds Darryn, their gaze a blend of guarded intensity and an almost restless curiosity, as though they are constantly calculating the next move.";
  inventory: any[] = [];
  weapons: any[] = [];
  options: any[] = [];
  canvas: any = null;


  loadedText: string[]= [];

  constructor(private gameService: GameService, private openAIService: OpenAIService

  ) { }

  ngOnInit() {
    console.log(this.combatBlock);
    this.player = this.gameService.getPlayer();
    this.inventory = this.gameService.getCurrentInventory();
    for (let weapon of this.inventory) {
      if (weapon.isWeapon) {
        this.weapons.push(weapon);
      }
    }
    console.log(this.weapons, this.inventory);
  }

  getAttacks() {
    this.options = this.weapons;
  }
  dodge(){};
  getInventory(){}

  async attack(item: IItem) {
    const target = {
      id: 1,
      name: " spectral captain",
      description: "Faint, and ghostly against the view behind, the commanding presence of the spectral captain smiles with crooked teeth. Long garbs cover head to toe, with a bandanna tying up ginger, dreaded, locks. His hands arched and pointed like misshapen claws, and the peg leg thudding against the ground as he walks. Or Charges.",
      AC: 12,
      weapons: [
        {
          id: 1,
          name: "Spectral Claws",
          description: "Long, semi-transparent claws...",
          image: "💀",
          damage: 5,
          bonus: 1,
          isWeapon: true
        }
      ],
      health: 18
    };

    if(this.combatBlock)    this.loadedText.push( await this.openAIService.generateText(this.playerDescription, item.description, target.description, this.combatBlock.description))
    // .subscribe((response: any) => {
    //   console.log(response.choices[0].text);
    // });
  }
}
