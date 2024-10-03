import { IItem } from "./item.modal";

export interface IStory{
	id: number;
	title: string;
	pathway: string;
	description:  string;
	items: IItem[];
	options: IOption[];
}

export interface IOption{
	name: string;
	description: string; //short description;
    collectedItems?: IItem[];
	targetStoryBlock: number; //Target IStoryBlock or ICombat
}