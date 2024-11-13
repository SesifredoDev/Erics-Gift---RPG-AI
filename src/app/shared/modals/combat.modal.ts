import { IItem, IWeapon } from "./item.modal";
import { IStory } from "./story.modal";

export interface ICombat extends IStory{
    isCombat: true;
    enemies: IEnemy[];
}
export interface IEnemy{
	name: string;
	id: number;
	AC: number; //armour class
	weapons: any[]; // items must have isWeapon be true
	health: number;
	description: string;
}

