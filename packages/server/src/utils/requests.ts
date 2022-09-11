import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { BitField, Client } from "discord.js";

import { log } from "./logger";

import { prisma } from "index";

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

export async function getGuilds(token: string, client: Client) {
	const managedServersArray = [];

	const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
		headers: {
			authorization: `Bearer ${token}`,
		},
	}).then((res) => res.json());

	if (userGuilds.message) {
		log(userGuilds.message);
	}

	for (const guild of userGuilds) {
		const permissionsBitfield = new BitField(guild.permissions).has("32");
		const isBotInGuild = client.guilds.resolve(guild.id) !== null;

		guild.bot = isBotInGuild;

		if (permissionsBitfield) {
			managedServersArray.push(guild);
		}
	}

	managedServersArray.sort((a) => (a.bot === false ? 1 : -1));

	return managedServersArray;
}

export async function getStats(client: Client) {
	const retrieveUsers = client.guilds.cache.reduce((acc, guild) => {
		if (!guild.available) return;

		return acc + guild.memberCount;
	}, 0);

	const stats = {
		users: retrieveUsers,
		servers: client.guilds.cache.size,
	};

	return stats;
}

export async function manageGuild(guildId: string, client: Client) {
	const [welcomeChannel, birthdaysChannel] = await Promise.all([await prisma.welChannels.findUnique({ where: { idOfGuild: guildId } }), await prisma.birthdaysChannels.findUnique({ where: { idOfGuild: guildId } })]);

	const guild = client.guilds.resolve(guildId);

	Object.assign(guild, {
		welcome: welcomeChannel?.idOfChannel ?? "unspecified",
		birthdays: birthdaysChannel?.idOfChannel ?? "unspecified",
	});

	return guild;
}
