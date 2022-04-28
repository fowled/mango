import { Client, CommandInteraction, Message } from "discord.js";

import type { PrismaClient } from "@prisma/client";

export interface Command {
	name: string;
	description: string;
	category: string;
	options?: [{ name: string; type: string; description: string; required: boolean }];
	subcommands?: [
		{
			name: string;
			description: string;
			type: number;
			options?: [{ name: string; type: string; description: string; required: boolean }];
		}
	];
	botPermissions?: string[];
	memberPermissions?: string[];
	execute(Client: Client, interaction: CommandInteraction & Message, args: string[], db: PrismaClient): Promise<void>;
}
