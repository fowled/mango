interface Base {
	content?: string;
	length?: number;
	maxLength?: number;
}

export interface ManageGuild {
	[key: string]: Base;
	quote: Base;
	welcome: Base;
}
