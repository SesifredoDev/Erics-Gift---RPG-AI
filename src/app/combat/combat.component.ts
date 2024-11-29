import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICombat, IEnemy } from '../shared/modals/combat.modal';
import * as p5 from 'p5';
import { GameService } from '../shared/services/game.service';
import { IItem, IWeapon } from '../shared/modals/item.modal';
import { OpenAIService } from '../shared/services/open-ai.service';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import DiceBox from '@3d-dice/dice-box';
import DisplayResults from '@3d-dice/dice-box';
import { delay, timeInterval } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';



@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
})
export class CombatComponent implements OnInit {

  @ViewChild('combatDetailsElement') private combatDetailsElement!: IonContent;
  @ViewChild('diceContainer', { static: true }) diceContainer!: ElementRef<HTMLDivElement>;
  private diceBox!: any;
 // 20 min kiss
  combatBlock?: ICombat;
  player: any = null;
  playerDescription: string = "Darryn is a lithe, wiry figure, their movements imbued with the ease and precision of someone accustomed to living in the shadows. They wear a fitted, dark leather tunic reinforced with subtle, overlapping scales for protection without sacrificing agility. A hood, often drawn low, casts a shadow over sharp features—cheekbones high and prominent, framing a pair of keen, observant eyes that glint like shards of polished steel. Their skin bears the faint, sun-kissed tone of someone often outdoors yet cloaked in shadow. A small collection of scars—a nick on the brow, a faint line across one hand—suggests experience rather than recklessness. At their side, a pair of daggers rest in worn leather sheaths, the hilts wrapped in strips of dark cloth for a surer grip. A weathered pouch hangs from their belt, hinting at hidden supplies, and their boots, soft-soled and expertly worn-in, make no sound even on the roughest ground. A faint air of mystery surrounds Darryn, their gaze a blend of guarded intensity and an almost restless curiosity, as though they are constantly calculating the next move.";
  inventory: any[] = [];
  weapons: any[] = [];


  enemies: IEnemy[] = [];
  activeTarget?: IEnemy;


  options: any[] = [];
  canvas: any = null;

  initiative:  { isPlayer: boolean; enemyid?: number; roll: number; }[] = [];
  currentTurn: number = -1;

  touchy: boolean = false;

  stage: string = 'null';

  typingspeed: number = 15;

  
  Display = new DisplayResults()


  loadedText: string[]= [
    // "As the spectral captain brandishes his gleaming cutlass, his ragged crew closes in, forming a tight circle around Darryn. Despite the eerie chill that seeps into their bones, Darryn's expression remains stoic, their eyes sharp and calculating. With a fluid, practiced motion, they draw one of the iron daggers from its sheath, the blade catching a sliver of moonlight. The captain lunges forward, his cutlass slicing through the cold night air. Anticipating the move, Darryn sidesteps with the grace of a shadow, the soft soles of their boots silent against the weathered deck. In one seamless arc, they bring their dagger up, aiming for the spectral captain's exposed side, where the tattered remnants of his coat flutter with his movements. The dagger's blade meets a ghostly resistance, less like piercing flesh and more like stirring air, yet it disrupts the captain's form, causing him to stagger back, a look of surprise flickering across his transparent features. Capitalizing on his momentary disorientation, Darryn twirls, dodging an attack from a nearby ghostly crew member, and strikes again. This time, the iron bites deeper, carving a swath through the apparition's misty silhouette. The spectral captain's crooked smile falters, his form flickering like a disturbed shadow, as an ethereal groan echoes through the ship, the chilling wind whipping fiercely as if in response to the blow.",
    // "As the spectral captain brandishes his gleaming cutlass, his ragged crew closes in, forming a tight circle around Darryn. Despite the eerie chill that seeps into their bones, Darryn's expression remains stoic, their eyes sharp and calculating. With a fluid, practiced motion, they draw one of the iron daggers from its sheath, the blade catching a sliver of moonlight. The captain lunges forward, his cutlass slicing through the cold night air. Anticipating the move, Darryn sidesteps with the grace of a shadow, the soft soles of their boots silent against the weathered deck. In one seamless arc, they bring their dagger up, aiming for the spectral captain's exposed side, where the tattered remnants of his coat flutter with his movements. The dagger's blade meets a ghostly resistance, less like piercing flesh and more like stirring air, yet it disrupts the captain's form, causing him to stagger back, a look of surprise flickering across his transparent features. Capitalizing on his momentary disorientation, Darryn twirls, dodging an attack from a nearby ghostly crew member, and strikes again. This time, the iron bites deeper, carving a swath through the apparition's misty silhouette. The spectral captain's crooked smile falters, his form flickering like a disturbed shadow, as an ethereal groan echoes through the ship, the chilling wind whipping fiercely as if in response to the blow.",
    // "As the spectral captain brandishes his gleaming cutlass, his ragged crew closes in, forming a tight circle around Darryn. Despite the eerie chill that seeps into their bones, Darryn's expression remains stoic, their eyes sharp and calculating. With a fluid, practiced motion, they draw one of the iron daggers from its sheath, the blade catching a sliver of moonlight. The captain lunges forward, his cutlass slicing through the cold night air. Anticipating the move, Darryn sidesteps with the grace of a shadow, the soft soles of their boots silent against the weathered deck. In one seamless arc, they bring their dagger up, aiming for the spectral captain's exposed side, where the tattered remnants of his coat flutter with his movements. The dagger's blade meets a ghostly resistance, less like piercing flesh and more like stirring air, yet it disrupts the captain's form, causing him to stagger back, a look of surprise flickering across his transparent features. Capitalizing on his momentary disorientation, Darryn twirls, dodging an attack from a nearby ghostly crew member, and strikes again. This time, the iron bites deeper, carving a swath through the apparition's misty silhouette. The spectral captain's crooked smile falters, his form flickering like a disturbed shadow, as an ethereal groan echoes through the ship, the chilling wind whipping fiercely as if in response to the blow."
  ];

  constructor(
    private gameService: GameService,
    private openAIService: OpenAIService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,

  ) { }

  async ngOnInit() {
    
    const container = this.diceContainer.nativeElement
//  Dice Set Up
    if (!container) {
      console.error('The dice container element is missing!');
      return;
    }

    // Initialize the DiceBox with the DOM element
    this.diceBox = new DiceBox({
      assetPath: '/assets/dice-box/',
    });

    // Wait for DiceBox to initialize
    await this.diceBox.init();

    this.player = this.gameService.getPlayer();
    this.player.currentHealth = this.player.health;
    this.inventory = this.gameService.getCurrentInventory();
    if(this.combatBlock?.enemies)  this.enemies = this.combatBlock?.enemies;
    for (let weapon of this.inventory) {
      if (weapon.isWeapon) {
        this.weapons.push(weapon);
      }
    }
    console.log(this.weapons, this.inventory);
    if(this.combatBlock?.limitation) this.openAIService.initChain(this.playerDescription, this.combatBlock?.description, this.combatBlock.limitation);
    else if(this.combatBlock)    this.openAIService.initChain(this.playerDescription, this.combatBlock?.description);
  }

  async nextTurn() {
    console.log(this.enemies)
    console.log(this.initiative);
    this.stage = 'deciding turn'
    this.currentTurn = this.currentTurn + 1;
    if (this.currentTurn >= this.initiative.length) this.currentTurn = 0;

    let current = this.initiative[this.currentTurn];
    console.log(current);
    let topLoadedText = this.loadedText.length;

    if (current.isPlayer) {
      this.stage = 'playerTurn' 
        this.touchy = true;
    } else if (!current.isPlayer && current.enemyid !== undefined) {
      this.stage = 'enemyTurn'
        this.touchy = false;
        let currentEnemy = this.enemies.find(enemy => enemy.id === current.enemyid);
        if(currentEnemy == undefined) {
          this.nextTurn();
          return;
        }

        


        await this.typeText(`Enemy Turn: ${currentEnemy.name}`, topLoadedText);

        let choice = this.randomIntFromInterval(1, currentEnemy.weapons.length);
        let weapon = currentEnemy.weapons[choice - 1];

        await new Promise(resolve => setTimeout(resolve, 3000)); // 1-second delay
        await this.typeText(`Enemy Attacking with ${weapon.name}`, topLoadedText);

        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
        let hit = this.randomIntFromInterval(1, 20) + weapon.bonus;
        console.log(hit);
        if (hit > this.player.AC) {
            let damage = this.randomIntFromInterval(1, weapon.damage * 6);
            await this.typeText(`${currentEnemy.name} hits you for ${damage} damage`, topLoadedText);
            this.player.currentHealth -= damage;

            await this.typeText(
                await this.openAIService.generateEnemyAttack(
                    weapon.description,
                    currentEnemy.name,
                    currentEnemy.description,
                    false,
                    this.player.health
                ),
                topLoadedText
            );

            if (this.player.currentHealth <= 0) {
                this.leave(false);
                return;
            }

            this.stage = 'nextTurn'
        } else {
            await this.typeText(
                await this.openAIService.generateEnemyAttack(
                    weapon.description,
                    currentEnemy.name,
                    currentEnemy.description,
                    true,
                    this.player.health
                ),
                topLoadedText
            );
            this.stage = 'nextTurn'
        }
    }
}
  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  rollInitiative(){
    let topLoadedText = this.loadedText.length;
    this.loadedText[topLoadedText] = "Loading Result..."
    let targetDescription = ''
    this.diceBox.roll('1d20');
    this.diceBox.onRollComplete = async (DiceResult: any) => { 
      let rollResults = []
      let result: number = (this.player.dexterity -10)/2 +  DiceResult[0].value;
      rollResults.push({isPlayer: true, roll: result})
      this.loadedText[topLoadedText] = `Initiative Roll: ${DiceResult[0].value} + ${(this.player.dexterity -10)/2}`;
      
      for (let i = 0; i <this.enemies.length; i++) {
        let enemyInitiative = this.randomIntFromInterval(1, 20);
        rollResults.push({isPlayer: false, enemyid:this.enemies[i].id, roll:enemyInitiative})
      }

      rollResults.sort((a,b) => b.roll - a.roll);

      this.initiative = rollResults;
      console.log(this.initiative)
      this.nextTurn();
    }
  }

  getAttacks() {
    this.stage = 'attackTarget';
    // .roll('1d20');
    console.log(this.stage);
  }
  selectTarget(option: IEnemy) {
    this.activeTarget= option;
    this.stage = 'attackWeapon'
  }

  dodge(){};
  getInventory(){}

  async attack(item: IWeapon) {
    let enemyIndex: number = -1;
    console.log(this.enemies)
    if (this.enemies) enemyIndex = this.enemies.findIndex(enemy => enemy === this.activeTarget);
    if (this.activeTarget && !this.activeTarget.currentHealth) this.activeTarget.currentHealth = this.activeTarget.health;

    this.touchy = false;

    // Set up Typing
    let topLoadedText = this.loadedText.length;
    this.loadedText[topLoadedText] = "Loading Result...";
    let targetDescription = "";

    console.log(this.activeTarget)

    // Roll for attack
    this.diceBox.roll("1d20");
    this.diceBox.onRollComplete = async (DiceResult: any) => {
        let rollResult = DiceResult[0].value + item.bonus;
        let failed = false;
        let finishing = false;
        if (this.activeTarget?.description !== undefined)
          targetDescription = `${this.activeTarget.name} - ${this.activeTarget.description}`;
      console.log(targetDescription);
        // Determine if the roll hits
        if (this.activeTarget && rollResult >= this.activeTarget.AC) {
            await this.typeText(`Hit! (Rolled: ${DiceResult[0].value} + ${item.bonus} = ${rollResult})`, topLoadedText);

            if (item.damage) {
              let damage = 0;
              // Add a delay before rolling damage
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
                if(item.type){
                  if(item.type  ==  'str') damage += (this.player.strength  -10)/2;
                  if(item.type  ==  'con') damage += (this.player.constitution  -10)/2;
                  if(item.type  ==  'dex') damage += (this.player.dexterity  -10)/2;
                  if(item.type  ==  'int') damage += (this.player.intelligence  -10)/2;
                  if(item.type  ==  'wis') damage += (this.player.wisdom  -10)/2;
                  if(item.type  ==  'cha') damage += (this.player.charisma  -10)/2;
                }
                this.diceBox.roll(`${item.damage}d6`);
                this.diceBox.onRollComplete = async (damageResult: any) => {
                    damage += damageResult[0].value;
                    

                    // Update target health and loadedText
                    if (this.activeTarget?.currentHealth !== undefined) {
                        this.activeTarget.currentHealth -= damage;
                        await this.typeText(`Damage dealt: ${damage}`, topLoadedText);
                        if (this.activeTarget && enemyIndex >= 0) this.enemies[enemyIndex] = this.activeTarget;

                        // Check if the target is defeated
                        if (this.activeTarget.currentHealth <= 0) {
                            finishing = true;
                            await this.typeText(`Target defeated!`, topLoadedText);
                            if (this.activeTarget.id !== undefined) {
                              this.enemies = this.enemies.filter(enemy => enemy.id !== this.activeTarget?.id);
                              
                              console.log(this.activeTarget.id, this.enemies)
                              
                            };
                            
                            
                        }
                    }
                    this.diceBox.clear();


                    try {
                      let result = "";


                      // If the blow was a killing bow, request description, remove the enemy from both the initiative and enemies list
                      if (finishing) {
                        const alert = await this.alertCtrl.create({
                          header: "How do you want to do this?",
                          inputs: [
                              {
                                  type: "textarea",
                                  placeholder: `${this.player.name} brings their fist down upon ${this.activeTarget?.name}`,
                              },
                          ],
                          buttons: ["OK"],
                          backdropDismiss: false,
                      });
                      await alert.present();
          
                      await alert.onDidDismiss().then(async (killDescriptionAlert: any) => {
                          console.log(killDescriptionAlert);
                          const userDescription = killDescriptionAlert.data?.values?.[0];
                          this.loadedText[topLoadedText] =(userDescription);
          
                          let result = await this.openAIService.killingResponse(userDescription);
                          await this.typeText(result, topLoadedText, true);
                      });
                      } else if (this.activeTarget?.currentHealth) {
                          const generatedAttack = await this.openAIService.generateAttack(
                              item.description,
                              this.activeTarget.name,
                              targetDescription,
                              failed,
                              this.activeTarget.currentHealth / this.activeTarget.health
                          );
                          await this.typeText(generatedAttack, topLoadedText, true);
                      }
                  } catch (e) {
                      const toast = await this.toastCtrl.create({
                          message: "Error while processing the attack",
                          duration: 2000,
                          color: "danger",
                      });
                      toast.present();
                  }
                  
                  this.stage = 'nextTurn'
                };
            }
        } else if (this.activeTarget && rollResult < this.activeTarget.AC) {
            // Handle miss case
            await this.typeText(`Miss! (Rolled: ${DiceResult[0].value} + ${item.bonus} = ${rollResult})`, topLoadedText);
            failed = true;
        }

        this.diceBox.clear();

        

        
    };
}

  async typeText(text: string, target: number, player?: boolean): Promise<void> {
    this.touchy = false;
    this.loadedText[target] = ""; // Clear previous text
    let index = 0;

    return new Promise<void>((resolve) => {
        const type = () => {
            if (index < text.length) {
                this.loadedText[target] += text.charAt(index);
                index++;
                setTimeout(type, this.typingspeed); // Adjust typing speed
                // this.combatDetailsElement.scrollToBottom(400);
            } else {
                resolve(); // Resolve the promise when typing is done
            }
        };
        type();
    });
}

async speedup(){
  this.typingspeed = 1; // 100ms per character
  setTimeout(() =>{this.typingspeed = 10}, 3000)
}




  // Enemy Moves



  clearSelection(){
    this.stage = 'null';
    this.activeTarget = undefined;
    this.diceBox.clear();
  }

  leave(win: boolean){
    this.clearSelection();
    this.stage  =  'end'
    this.typeText(win? 'You win!' : 'You lose!', this.loadedText.length);

  }

}

