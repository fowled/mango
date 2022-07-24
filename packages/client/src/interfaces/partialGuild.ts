export interface PartialGuild {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: number;
	features: [];
	permissions_new: string;
	bot: boolean;
}
