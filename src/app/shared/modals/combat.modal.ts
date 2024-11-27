import { IItem, IWeapon } from "./item.modal";
import { IStory } from "./story.modal";

export interface ICombat extends IStory{
    isCombat: true;
    enemies: IEnemy[];
	limitation: string; // add a guide for narrative of fight, like where the fight should end, or if an enemy should always say one thing at least once during the battle.
}
export interface IEnemy{
	name: string; // the name of the enemy
	id: number;
	AC: number; //armour class
	weapons: IWeapon[]; // items must have isWeapon be true
	health: number; //maximum health
	currentHealth?: number;  //for during combat
	description: string; //description of the enemy
}

