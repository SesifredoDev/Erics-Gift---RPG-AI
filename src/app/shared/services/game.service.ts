import { Injectable } from '@angular/core';
// import * as game from '../game.json';
import { IStory } from '../modals/story.modal';
import { IItem } from '../modals/item.modal';
import { Observable, Subject } from 'rxjs';
import { ICombat } from '../modals/combat.modal';
@Injectable({
  providedIn: 'root'
})
export class GameService {
  // data: any  = game;
  game: IStory[] =  [];
  items: IItem[] = [];

  rolls: {statType:string, roll:number}[]  =  [];

  inventory: Subject<IItem[]> = new Subject;

  defaultPlayerStats= {
    health: 100,
    AC: 15,
    strength: 12,
    dexterity: 16,
    constitution: 15,
    intelligence: 16,
    wisdom: 8,
    charisma: 12,

  }

  player: any;
  gameState?: any;

  constructor() { 

  }

  async intialiseGame(){
    // Initialise game state, items, etc.
    // For example, load saved game state from local storage
    // or create a new game with default settings
    try{
      
        await fetch("assets/game.json").then(res=>res.json()).then(json=>{
          this.game = json
          console.log(this.game)
          if(this.game.length <=0) throw new Error("No game data found");  // or return default game state if no data is available
          // Or return a default game state
          let gameStateTemp: string = String(localStorage.getItem("gameState"))
          this.gameState = JSON.parse( gameStateTemp );

          if(!this.gameState) this.gameState = {
              currentStory: 0,
              inventory: [
                {
                  "id": 4,
                  "name": "Balanced Dagger",
                  "description": "A well-balanced dagger, ideal for throwing. Its aerodynamic design allows for controlled and accurate throws.",
                  "image": "🔪",
                  "bonuses": [{ "name": "Throwing Accuracy", "bonus": 1 }],
                  "damage": "2d8 + 2",
                  "bonus": 0,
                  "isWeapon": true
                },
                
                {
                  "id": 5,
                  "name": "Derringer",
                  "description": " A small, finely crafted hand crossbow designed for quick and stealthy use. Its darkwood frame is reinforced with polished steel, and the grip bears faint arcane runes that shimmer in low light. It can fire specially crafted bolts up to 30 feet with surprising precision. While not as powerful as a standard crossbow, its portability and ease of concealment make it a favorite among rogues and spies.",
                  "image": "🔫",
                  "bonuses": [{ "name": "dex", "bonus": 1 }],
                  "damage": "3d4",
                  "bonus": 0,
                  "isWeapon": true
                }
              ]
              ,
              playerStats:this.defaultPlayerStats,
          };

          if(!this.gameState.playerStats) this.player = this.defaultPlayerStats;
          if(!this.player) this.player = this.gameState.playerStats;

          this.inventory.next(this.gameState.inventory); 
          localStorage.setItem("gameState", JSON.stringify(this.gameState));

          return this.gameState
        
        
          //DO YOUR STAFF
        });
        



    }catch(err){
      console.log( 'err: ', err)
    }
  }


  initInventory(){
    this.inventory.next(this.gameState.inventory);
    this.saveGameState();  // Save the updated inventory to local storage
  }

  getPlayer(){
    return this.player;
  }

  getInventory(){
    console.log(this.gameState.inventory);
    return this.inventory;
  
  }

  getCurrentInventory(){
    return this.gameState.inventory;
  }

  addItem(item: IItem){
    this.gameState.inventory.push(item);
    this.inventory.next(this.gameState.inventory);
    this.saveGameState(); 
  }

  loadNextScene(id:number): IStory| ICombat{
    let result: IStory | ICombat | undefined;
    result =  this.game.find(story=>story.id == id);
    if(!result) return  {
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
    this.gameState.currentStory = result.id;
    this.saveGameState();
    return result;
  }

  saveGameState(){
    localStorage.setItem("gameState", JSON.stringify(this.gameState));
    // localStorage.setItem("playerState", JSON.stringify(this.playerStats));
  }

  resetGame(){
    localStorage.removeItem("gameState");
    this.gameState = undefined;
    this.inventory.next([]);
    this.game = [];
    this.items = [];
    this.loadNextScene(0);
  }

  addStatRoll(result: number, type: string  ){
    this.rolls.push({statType: type, roll: result});
  }



  async readJsonData(fileName: string){    
    let result: any = [];
    await fetch(fileName).then(res=>res.json()).then(json=>{
        this.game = json
        //DO YOUR STAFF
    });
  }




}
