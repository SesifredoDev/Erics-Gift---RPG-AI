import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ai from 'unlimited-ai'
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

    constructor(private http: HttpClient) {}

    async generateText(playerDescription: string, itemDescription: string, targetDescription: string, areaDescription: string){
      let model = 'gpt-4-turbo-2024-04-09';
      let messages = [
        { role: 'user', content: `Player Description: ${playerDescription}` },
        { role: 'user', content: `Weapon Description: ${itemDescription}` },
        { role: 'user', content: `Target Description: ${targetDescription}` },
        { role: 'user', content: `story Description: ${areaDescription}` },
        
        { role: 'user', content: `Describe the player attacking the target with the weapon, please keep the description to 1 to 2 paragraphs` },
      ];
    
      return await ai.generate(model, messages); // 'Hello there! How can I be of assistance to you today?'
    }
}
