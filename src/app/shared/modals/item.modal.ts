export interface IItem{
	id: number;
	name:string;
	description: string; //brief description of item
    image: string; //emoji
    bonuses:  {
		name: 'str' | 'con' | 'dex'  | 'int'  |  'wis'  | 'cha' | 'hp'; //the name of the stat that will be boosted by the item, e.g:   'str' boosts strength
		bonus:number, //amount that the stat will be increased
	}[]
}
export interface IWeapon extends IItem{
	damage: number; //amount of d6 die will be rolled equal to this amount, and then taken from targets health
	bonus: number; //a number added to a d20 roll determining if it hits an enemy.
	type?: 'str' | 'con' | 'dex'  | 'int'  |  'wis'  | 'cha'; //not required for every weapon but if it has a type, the stat  will be  used to increase this bonus
    isWeapon: true;
}