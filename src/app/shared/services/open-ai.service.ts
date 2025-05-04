import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private messages: any[] = [];
  private addedDescriptions: Set<string> = new Set();


  
  
  private key : string = environment.API_KEY
  private genAI = new GoogleGenerativeAI(this.key);
  private model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  constructor(private http: HttpClient) {}

  async initChain(playerDescription: string, areaDescription: string, limitation?: string) {
    this.messages = [
       `Whenever asked for a description, provide a detailed response—never just "Ok!" or similar.`,
        `Player Description: ${playerDescription}`,
      `Story Description: ${areaDescription}`,
      `Write descriptions as a continuous, flowing narrative—each action naturally leading to the next.`,
      `Descriptions should be engaging and maintain immersion in the fight. Limit to 2 to 4 sentences though.`,
      `Never return with information I have parsed to you.`
    ];
    if (limitation) {
      this.messages.push(`Limitation: ${limitation}`);
    }
  }

  async generateAttack(itemDescription: string, targetName: string, targetDescription: string, fail: boolean, lifePercentage: number) {
    this.messages.push(`New Player Attack - Weapon: ${itemDescription}` );

    const targetKey = `${targetName} ${targetDescription}`;
    if (!this.addedDescriptions.has(targetKey)) {
      this.messages.push( `Target: ${targetName} - ${targetDescription}` );
      this.addedDescriptions.add(targetKey);
    } else {
      this.messages.push(`Player attacks ${targetName}.` );
    }

    this.messages.push(fail ? `The attack misses.` : `The attack lands. The target is weakened, now struggling at ${Math.floor(lifePercentage * 100)}% health. Do not include in the  description`);

    this.messages.push( `Describe the attack in one immersive paragraph, flowing naturally from the previous scene. Avoid mentioning percentage numbers directly.`);

    return this.runResponse();
  }

  async generateEnemyAttack(itemDescription: string, enemyName: string, enemyDescription: string, fail: boolean, lifePercentage: number) {
    this.messages.push( `New Enemy attack  - Weapon: ${itemDescription}` );

    const enemyKey = `${enemyName} ${enemyDescription}`;
    if (!this.addedDescriptions.has(enemyKey)) {
      this.messages.push(`Enemy: ${enemyName} - ${enemyDescription}`);
      this.addedDescriptions.add(enemyKey);
    }

    this.messages.push(`${enemyName} lunges at the player with the weapon.` );

    this.messages.push(fail ? `The attack misses.` : `The hit lands, and the player weakens, struggling at ${Math.floor(lifePercentage * 100)}% health.`);

    this.messages.push(`Describe ${enemyName} attacking Darryn in one intense, immersive paragraph, continuing naturally from the previous fight scene.`);

    return this.runResponse();
  }

  async killingResponse(playerDescription: string, targetName: string) {
    this.messages.push( `Killing Blow - Final Attack: ${playerDescription}. This kills the target, ${targetName}.`);
    this.messages.push( `reDescribe the finishing move naturally within the fight's context, ensuring an impactful moment. Keep it to one paragraph.`);

    return this.runResponse();
  }

  private async runResponse(messages?: any[]): Promise<string> {
    let functionMessages = messages ?? this.messages;
    functionMessages.forEach((element,idx) => {
      functionMessages[idx]  = JSON.stringify(element);
    });
    let result: any = '';

    for (let i = 0; i < 3; i++) { // Retry up to 3 times for a valid response
      result = (await this.model.generateContent(functionMessages)).response.text();
      console.log(result)
      if (result.length > 5) break;
      console.warn(`Bad response received: "${result}". Retrying...`);
    }

    if (result.length <= 5) {
      console.error(`Failed to generate a valid response after retries. Returning fallback message.`);
      result = "The battle rages on, but the outcome remains uncertain...";
    }

    this.messages.push( result );
    return result;
  }
}
