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

  defaultPlayerStats= {
    health: 100,
    AC: 13,
    strength: 16,
    dexterity: 14,
    constitution: 10,
    intelligence: 12,
    wisdom: 12,
  }




  gameState?: any;
  inventory: Subject<IItem[]> = new Subject;

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
              inventory: [],
              playerStats:this.defaultPlayerStats,
          };

          this.inventory.next(this.gameState.inventory);
          localStorage.setItem("gameState", JSON.stringify(this.gameState));

          return this.gameState
          
        
          //DO YOUR STAFF
        });
        



    }catch(err){
      console.log( 'err: ', err)
    }
  }

  getInventory(){
    return this.gameState.inventory;
  }

  addItem(id: number){
    let item = this.items.find(item=>item.id === id);
    if(!item) return;
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
