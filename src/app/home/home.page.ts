import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { GameService } from '../shared/services/game.service';
import { IOption, IStory } from '../shared/modals/story.modal';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ICombat } from '../shared/modals/combat.modal';
import { CombatComponent } from '../combat/combat.component';
import { IItem } from '../shared/modals/item.modal';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  activateOptions:boolean = false;
  storyBlock: any = {
    "id": 0,
    "title": "Embark on an Epic Adventure with Darryn!",
    "pathway": "Start weaving your own threads",
    "description": "Step into a richly woven tale of mystery, danger, and choice in a fractured world where every decision shapes your destiny. As Darryn, a rogue with a forgotten legacy, you’ll navigate ancient ruins, battle fearsome foes, and uncover powerful relics. Forge your path through gripping combat, strategic exploration, and moral dilemmas. Will you restore balance, wield ultimate power, or succumb to the shadows? The fate of the realm is in your hands. Adventure awaits—dare to answer the call!",
    "items": [],
    "options": [{
      "name": "start",
      "description": "Start Darryn's adventure",
      "collectedItems": [],
      "targetStoryBlock": 1
    },]
  };

  displayedText: string = ''; // Variable to store the displayed text
  typingSpeed: number = 0; // Speed of typing in milliseconds

  constructor(private gameService: GameService, public modalController: ModalController, public alertController: AlertController, private toastController: ToastController) { }

  async ngOnInit() {
    await this.gameService.intialiseGame(); // Initialise the game state if not already done
    
    let intialisedStoryBlock = this.gameService.loadNextScene(this.gameService.gameState.currentStory)
    this.showStoryBlock(intialisedStoryBlock); // Show the initial story block
  }

  showStoryBlock(storyBlock: IStory) {
    this.activateOptions= false;
    this.storyBlock = storyBlock;
    this.displayedText = ''; // Reset displayed text
    this.typeText(this.storyBlock.description);
  }

  async typeText(text: string) {
    let index = 0;
    const type = () => {
      if (index < text.length) {
        this.displayedText += text.charAt(index);
        index++;
        setTimeout(type, this.typingSpeed);
      }else{
        this.activateOptions = true;
        }
    };
    await type();
    
  }

   onOptionSelected(option: IOption) {
    if(this.activateOptions){
      option.collectedItems?.forEach(async (e:IItem)=>{
        this.gameService.addItem(e);
        const toast = await this.toastController.create({
          message: `Added ${e.name} to your inventory`, 
          duration: 1500,
          position:'bottom',
          color:'green',
          cssClass: ".itemAdded"
        });

        console.log("Collected "+ e.name)
    
        await toast.present();
      })
      this.gameService.rolls = [];
      let newScene: any =  this.gameService.loadNextScene(option.targetStoryBlock);
      this.storyBlock = newScene;
      this.showStoryBlock(this.storyBlock); // Trigger typing animation for the new story block
    }
    
  }

  optionAvailable(option: IOption): boolean{
    let result = false;
    if(option.require){
      this.gameService.rolls.forEach((e)=>{
        if(e.statType == option.require?.type){
          if(option.require.fail  == true  &&  e.roll  < option.require.boundry){
            result = true;
          }else if(option.require.fail  == false  &&  e.roll  >= option.require.boundry){
            result = true;
          }
        }
      })
    }else{
      result = true;
    }
    
    return result;
  }

  async openCombat(combatBlock: ICombat){
    const modal = await this.modalController.create({
      component: CombatComponent,
      componentProps: { combatBlock },
      cssClass: 'combat-modal',
      backdropDismiss: false,
    });
    await modal.present();
    modal.onDidDismiss().then(async (modalResponse: any) =>{
      let combatResult: boolean = modalResponse.data;
      let result: IOption;
      if(combatResult == true){
        result = combatBlock.options[0];
      }else{
        result = combatBlock.options[1];
      }
      const alert = await this.alertController.create({
        header: result.name,
        message: result.description,
        buttons: ["OK"],
        backdropDismiss: false,
    });
    await alert.present();

    await alert.onDidDismiss().then(async (killDescriptionAlert: any) => {
      this.onOptionSelected(result);
    })


    })
  }



  // Reset Game
  resetGame(){
    this.gameService.resetGame();
    this.ngOnInit(); // Reload the page to start a new game
  }

  async speedup(){
    this.typingSpeed = 1; // 100ms per character
    setTimeout(() =>{this.typingSpeed = 10}, 6000)
  }
}
