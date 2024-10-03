export interface IItem{
	id: number;
	name:string;
	description: string;
    image: string; //ASCII art 
    bonuses:  {name:string, bonus:number}[]
}
export interface IWeapon extends IItem{
	damage?: number; //a random number up to this number, damage could be dealt
	bonus?: number; //a number added to a d20 roll determining if it hits an enemy.
	
    isWeapon: true;
}