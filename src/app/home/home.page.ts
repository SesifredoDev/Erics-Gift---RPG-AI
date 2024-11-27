import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { GameService } from '../shared/services/game.service';
import { IStory } from '../shared/modals/story.modal';
import { ModalController } from '@ionic/angular';
import { ICombat } from '../shared/modals/combat.modal';
import { CombatComponent } from '../combat/combat.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  activateOptions:boolean = false;
  storyBlock: any = {
    "id": 0,
    "title": "Empty Story Block",
    "pathway": "A blank moment in Darryn's journey.",
    "description": "This block is intentionally left blank for future use.",
    "items": [],
    "options": [{
      "name": "start",
      "description": "Start Darryn's adventure",
      "collectedItems": [],
      "targetStoryBlock": 1
    },]
  };

  displayedText: string = ''; // Variable to store the displayed text
  typingSpeed: number = 15; // Speed of typing in milliseconds

  constructor(private gameService: GameService, public modalController: ModalController) { }

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

  onOptionSelected(option: number) {
    if(this.activateOptions){
      let newScene: any =  this.gameService.loadNextScene(option);
      this.storyBlock = newScene;
      this.showStoryBlock(this.storyBlock); // Trigger typing animation for the new story block
    }
    
  }

  async openCombat(combatBlock: ICombat){
    const modal = await this.modalController.create({
      component: CombatComponent,
      componentProps: { combatBlock },
      cssClass: 'combat-modal'
    });
    await modal.present();
    modal.onDidDismiss().then((data: any) =>{console.log(data)})
  }



  // Reset Game
  resetGame(){
    this.gameService.resetGame();
    this.ngOnInit(); // Reload the page to start a new game
  }

}
