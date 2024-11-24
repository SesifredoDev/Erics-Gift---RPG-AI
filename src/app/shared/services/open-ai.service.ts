import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ai from 'unlimited-ai'
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  messages: any[] = [];
  
  model = 'grok-2';

    async initChain(playerDescription: string, areaDescription: string){
      this.messages = [];
      this.messages.push({ role: 'user', content: `Player Description: ${playerDescription}` });
      this.messages.push({ role: 'user', content: `story Description: ${areaDescription}` })
      this.messages.push({ role: 'user', content: `Write any descriptions as one flowing piece of story of a fight, as if one action is followed by the next` })
      
      // try{
      //   let result = (await ai.generate('gpt-4-turbo-2024-04-09', this.messages)); // 'Hello there! How can I be of assistance to you today?'

      // }catch(err){
      //   console.log(err);
      // }
      
    }

    constructor(private http: HttpClient) {}

    async generateAttack(itemDescription: string, targetDescription: string, fail: boolean){
      this.messages.push(        { role: 'user', content: `Weapon Description: ${itemDescription}` });
      this.messages.push( { role: 'user', content: `Target Description: ${targetDescription}` });
      if (fail) this.messages.push({role:'user', content: 'This Attack misses'});
      this.messages.push( { role: 'user', content: `describe the player attacking the target with the weapon, please keep the description to 1 paragraph, continue the story from your previous description` });
      
      let result = await ai.generate(this.model, this.messages);
      this. messages.push( { role: 'system', content:result});
      return  result

    }

    async killingResponse(playerDescription: string){
      this.messages.push( { role: 'user', content:`player Description, this kills the target: ${playerDescription}`});
      this.messages.push( { role: 'user', content:`redescribe what the player says, in context to the rest of the fight, keep the description to 1 paragraph`});
      let result = await ai.generate(this.model, this.messages);
      this. messages.push( { role: 'system', content:result});
      return  result
    }
}



