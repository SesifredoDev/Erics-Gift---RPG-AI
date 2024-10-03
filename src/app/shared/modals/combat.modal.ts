import { IItem } from "./item.modal";
import { IStory } from "./story.modal";

export interface ICombat extends IStory{
    isCombat: true;
    enemies: IEnemy[];
}
export interface IEnemy{
	id: number;
	AC: number; //armour class
	weapons: IItem[]; // items must have isWeapon be true
	health: number;
	
}