import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ai from 'unlimited-ai'
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  messages: any[] = [];
  addedDescriptions: any[] = [];
  
  model = 'gemini-1.5-pro-exp-0827';

    async initChain(playerDescription: string, areaDescription: string, limitation?: string){
      this.messages = [];
      this.messages.push({ role: 'user', content: `Player Description: ${playerDescription}` });
      this.messages.push({ role: 'user', content: `story Description: ${areaDescription}` })
      this.messages.push({ role: 'user', content: `Write any descriptions as one flowing piece of story of a fight, as if one action is followed by the next` })
      if(limitation)  this.messages.push({ role: 'user', content:limitation});
      this.messages.push({ role: 'user', content: `Always write descriptions when asked, do not write any form of "ok" from now on` })
      
      
      // try{
      //   let result = (await ai.generate('gpt-4-turbo-2024-04-09', this.messages)); // 'Hello there! How can I be of assistance to you today?'

      // }catch(err){
      //   console.log(err);
      // }
      
    }

    constructor(private http: HttpClient) {}

    async generateAttack(itemDescription: string,targetName:string, targetDescription: string, fail: boolean, lifePercentage: number){
      this.messages.push(        { role: 'user', content: `Weapon Description: ${itemDescription}` });
      if(!this.addedDescriptions.includes(`${targetName} ${targetDescription}`)){
        this.messages.push( { role: 'user', content: `Target Description: ${targetName} ${targetDescription}` });
        this.addedDescriptions.push(`${targetName} ${targetDescription}`);
      }else{
        this.messages.push( { role: 'user', content: `Player is attacking Target: ${targetName}` });

      }
      
      if (fail) this.messages.push({role:'user', content: 'This Attack misses'});
      else this.messages.push({role:'user', content: `the target is on ${lifePercentage * 100}% health`});
      this.messages.push( { role: 'user', content: `describe the player attacking the target with the weapon, reflecting on life percentage (do not say the percentage), please keep the description to 1 paragraph, continuing the story from your previous description` });
      
      
      this.messages.push({ role: 'user', content:'provide the description in the next message'});
      let result = await ai.generate(this.model, this.messages);
      this. messages.push( { role: 'system', content:result});
      console.log(this.messages)
      return  result

    }

    async generateEnemyAttack(itemDescription: string,enemyName:string, enemyDescription: string, fail: boolean, lifePercentage: number){
      this.messages.push(        { role: 'user', content: `Weapon Description: ${itemDescription}` });
      if(!this.addedDescriptions.includes(`${enemyName} ${enemyDescription}`)){
        this.messages.push( { role: 'user', content: `Target Description: ${enemyName} ${enemyDescription}` });
        this.addedDescriptions.push(`${enemyName} ${enemyDescription}`);
      }
      
      this.messages.push( { role: 'user', content: `Enemy ${enemyName} is attacking the Payer` });
      
      if (fail) this.messages.push({role:'user', content: 'This Attack misses'});
      else this.messages.push({role:'user', content: `the player is on ${lifePercentage * 100}% health`});
      this.messages.push( { role: 'user', content: `limited to 1 paragraph, adn continuing from the last description, describe ${enemyName} attacking Darryn with the weapon` });
      
      let result = await ai.generate(this.model, this.messages);
      this. messages.push( { role: 'system', content:result});
      console.log(this.messages)
      return  result

    }

    async killingResponse(playerDescription: string){
      this.messages.push( { role: 'user', content:`player Description, this kills the target: ${playerDescription}`});
      this.messages.push( { role: 'user', content:`take the player description and remake it in context to the rest of the fight, keep the description to 1 paragraph`});

      let result = await ai.generate(this.model, this.messages);
      this. messages.push( { role: 'system', content:result});
      return  result
    }
}



