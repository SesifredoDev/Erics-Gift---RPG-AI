import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICombat, IEnemy } from '../shared/modals/combat.modal';
import * as p5 from 'p5';
import { GameService } from '../shared/services/game.service';
import { IItem, IWeapon } from '../shared/modals/item.modal';
import { OpenAIService } from '../shared/services/open-ai.service';
import { AlertController, ToastController } from '@ionic/angular';
import DiceBox from '@3d-dice/dice-box';



@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss'],
})
export class CombatComponent implements OnInit {

  @ViewChild('combatDetailsElement') private combatDetailsElement!: ElementRef;
  @ViewChild('diceContainer', { static: true }) diceContainer!: ElementRef<HTMLDivElement>;
  private diceBox!: any;

  combatBlock?: ICombat;
  player: any = null;
  playerDescription: string = "Darryn is a lithe, wiry figure, their movements imbued with the ease and precision of someone accustomed to living in the shadows. They wear a fitted, dark leather tunic reinforced with subtle, overlapping scales for protection without sacrificing agility. A hood, often drawn low, casts a shadow over sharp features—cheekbones high and prominent, framing a pair of keen, observant eyes that glint like shards of polished steel. Their skin bears the faint, sun-kissed tone of someone often outdoors yet cloaked in shadow. A small collection of scars—a nick on the brow, a faint line across one hand—suggests experience rather than recklessness. At their side, a pair of daggers rest in worn leather sheaths, the hilts wrapped in strips of dark cloth for a surer grip. A weathered pouch hangs from their belt, hinting at hidden supplies, and their boots, soft-soled and expertly worn-in, make no sound even on the roughest ground. A faint air of mystery surrounds Darryn, their gaze a blend of guarded intensity and an almost restless curiosity, as though they are constantly calculating the next move.";
  inventory: any[] = [];
  weapons: any[] = [];


  enemies: IEnemy[] | undefined = [];
  activeTarget?: IEnemy;


  options: any[] = [];
  canvas: any = null;

  touchy: boolean = true;

  stage: string = 'null';


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

    console.log(this.diceBox)


    console.log(this.combatBlock);
    this.player = this.gameService.getPlayer();
    this.inventory = this.gameService.getCurrentInventory();
    this.enemies = this.combatBlock?.enemies;
    for (let weapon of this.inventory) {
      if (weapon.isWeapon) {
        this.weapons.push(weapon);
      }
    }
    console.log(this.weapons, this.inventory);

    if(this.combatBlock)    this.openAIService.initChain(this.playerDescription, this.combatBlock?.description);
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
    this.touchy = false;
    //  Set up Typing
    let topLoadedText = this.loadedText.length;
    this.loadedText[topLoadedText] = "Loading Result..."
    let targetDescription = ''

    if(item.bonus !== undefined && item.bonus > 0)  this.loadedText[topLoadedText]=('1d20 + ' + item.bonus);
    else  this.loadedText[topLoadedText] =('1d20');

    this.diceBox.roll('1d20');
    this.diceBox.onRollComplete = async (DiceResult: any) => {  
      let rollResult = DiceResult[0].value + item.bonus;
      let failed = false;
      let finishing = false;
      if(this.activeTarget && rollResult >= this.activeTarget.AC){
        this.loadedText[topLoadedText] = 'Hit!'
        this.activeTarget.health -= rollResult;
        if(this.activeTarget.health <= 0) this.activeTarget.health = 0; finishing = true;

      }else if(this.activeTarget && rollResult < this.activeTarget.AC){
        this.loadedText[topLoadedText] = 'Miss!'
        failed = true;
      }




      if (this.activeTarget?.description !== undefined)  targetDescription = this.activeTarget.name + ' - ' + this.activeTarget.description;
      console.log(targetDescription)


      try{
        if(item.damage){
          let randomDamage = Math.random()*item.damage
          console.log(randomDamage)
          // target.health = target.health- Number(item?.damage);
        }
        let result = '';
        if(finishing) {
          const alert = await this.alertCtrl.create({  
            header: 'How do you want todo this?',  
            inputs: [
              {
                type: 'textarea',
                placeholder: `${this.player.name} brings their fist down upon ${this.activeTarget?.name}`,
              },
            ],
            buttons: ['OK'],
            backdropDismiss: false,
          });  
          await alert.present();
          alert.onDidDismiss().then(async (killDescriptionAlert: any)=>{
            console.log(killDescriptionAlert);
            this.loadedText.push(killDescriptionAlert.value);
            
            
            result = await this.openAIService.killingResponse( 'nothing');
            this.typeText(result, topLoadedText)
            
          })
        
        } else  this.typeText ( (await this.openAIService.generateAttack( item.description,targetDescription, failed)), topLoadedText)

        
      }catch(e){
        const toast = await this.toastCtrl.create({
          message: 'Error while processing the attack',
          duration: 2000,
          color: 'danger'
        })
        toast.present();
      }    

    }
    
    
    
    // .subscribe((response: any) => {
    //   console.log(response.choices[0].text);
    // });
  }

  async typeText(text: string, target: number) {
    this.touchy = false;
    this.loadedText[target] = "";  // Clear previous text
    let index = 0;
    const type = () => {
      if (index < text.length) {
        this.loadedText[target] += text.charAt(index);
        index++;
        setTimeout(type, 30);
      }else{
        
      this.touchy = true;  
      this.clearSelection(); 
      }
      
    };
    await type();
  }



  clearSelection(){
    this.stage = 'null';
    this.activeTarget = undefined;
  }

}

