import * as Discord from "discord.js";

import * as Binder from "./utils/EventsBinder";

import { Token } from "./token";

const Client: Discord.Client = new Discord.Client({ fetchAllMembers: true });

export const talkedRecently = new Set();
export const queue = new Map();

Client.on('error', console.error);

(async () => {
	await Binder.bind(Client);
	Client.login(Token);
})();
