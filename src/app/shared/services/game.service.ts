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
                  "id": 1,
                  "name": "Iron Dagger",
                  "description": "A standard iron dagger, durable and practical. Its blade is well-balanced, suitable for quick strikes and close combat.",
                  "image": "🔪",
                  "bonuses": [],
                  "damage": 3,
                  "bonus": 0,
                  "isWeapon": true
                },
                {
                  "id": 2,
                  "name": "Rusty Blade",
                  "description": "An old, slightly corroded dagger. Its edge is worn, but it can still deal a respectable cut in a pinch.",
                  "image": "🪓",
                  "bonuses": [],
                  "damage": 2,
                  "bonus": 0,
                  "isWeapon": true
                },
                {
                  "id": 3,
                  "name": "Steel Stiletto",
                  "description": "A slim, sharp dagger forged from steel, designed for piercing armor and precision strikes.",
                  "image": "🗡️",
                  "bonuses": [{ "name": "Armor Penetration", "bonus": 1 }],
                  "damage": 3,
                  "bonus": 1,
                  "isWeapon": true
                },
                {
                  "id": 4,
                  "name": "Balanced Dagger",
                  "description": "A well-balanced dagger, ideal for throwing. Its aerodynamic design allows for controlled and accurate throws.",
                  "image": "🔪",
                  "bonuses": [{ "name": "Throwing Accuracy", "bonus": 1 }],
                  "damage": 3,
                  "bonus": 0,
                  "isWeapon": true
                },
                {
                  "id": 5,
                  "name": "Shortblade",
                  "description": "A compact dagger, easy to conceal and quick to draw. Useful for stealthy attacks and close quarters.",
                  "image": "🗡️",
                  "bonuses": [{ "name": "Stealth Bonus", "bonus": 1 }],
                  "damage": 3,
                  "bonus": 0,
                  "isWeapon": true
                },
                
                {
                  "id": 5,
                  "name": "Derringer",
                  "description": " A small, finely crafted hand crossbow designed for quick and stealthy use. Its darkwood frame is reinforced with polished steel, and the grip bears faint arcane runes that shimmer in low light. It can fire specially crafted bolts up to 30 feet with surprising precision. While not as powerful as a standard crossbow, its portability and ease of concealment make it a favorite among rogues and spies.",
                  "image": "🔫",
                  "bonuses": [{ "name": "Stealth Bonus", "bonus": 1 }],
                  "damage": 3,
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
    }
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
  }



  async readJsonData(fileName: string){    
    let result: any = [];
    await fetch(fileName).then(res=>res.json()).then(json=>{
        this.game = json
        //DO YOUR STAFF
    });
  }




}
