import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { Guild, BitField } from "discord.js";

import { client } from "../../src/index";

export async function fetchToken(code: string) {
	const fetchToken = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",

		body: new URLSearchParams({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code,
			grant_type: "authorization_code",
			redirect_uri: process.env.REDIRECT_URI,
			scope: "identify guilds",
		}),

		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	}).then((res) => res.json());

	return fetchToken;
}

export async function fetchNewToken(refresh_token: string) {
	const fetchNewToken = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",

		body: new URLSearchParams({
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		}),

		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	}).then((res) => res.json());

	return fetchNewToken;
}

export async function getUser(token: string) {
	const userResult = await fetch("https://discord.com/api/users/@me", {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}).then((res) => res.json());

	return userResult;
}

export async function getGuilds(token: string) {
	const managedServersArray = [];

	const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}).then((res) => res.json());

	if (userGuilds.message) return;

	for (let guild of userGuilds) {
		const permissionsBitfield: boolean = new BitField(guild.permissions).has("32");
		const isBotInGuild: boolean = client.guilds.resolve(guild.id) != null;

		guild.bot = isBotInGuild;

		if (permissionsBitfield) {
			managedServersArray.push(guild);
		}
	}

	managedServersArray.sort((a) => (a.bot === false ? 1 : -1));

	return managedServersArray;
}

export async function getStats() {
	const retrieveUsers: number = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

	const stats = {
		users: retrieveUsers,
		servers: client.guilds.cache.size,
	};

	return stats;
}

export async function manageGuild(guildId: string) {
	let guildInfo: Guild | string = client.guilds.resolve(guildId);

	if (guildInfo == null) {
		guildInfo = "Bot isn't in guild.";
	}

	return guildInfo;
}
