import express, { Express, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { Guild, BitField } from "discord.js";
import { URLSearchParams } from "url";

import { log } from "../src/utils/Logger";
import { client } from "../src/index";
import { sequelizeinit } from "../src/index";

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({ db: sequelizeinit });

const app: Express = express();

declare module "express-session" {
	interface SessionData {
		token: string;
		refresh_token: string;
		date: Date;
	}
}

app.use(session({ secret: process.env.SESSION_SECRET, cookie: { secure: false }, store: store, resave: false, saveUninitialized: false }));

app.use(urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use(
	cors({
		origin: ["http://localhost:3000", "https://mango.bot"],
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

store.sync();

app.get("/", async function (req, res) {
	return res.send({ message: "Welcome to Mango's API!" });
});

app.get("/token", async function (req, res) {
	const code: string = req.query.code as string;

	const getToken = await fetchToken(code);
	const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

	req.session.token = getToken.access_token;
	req.session.date = nextWeekDate;

	return res.status(403).send({ message: "Unauthorized" });
});

app.get("/refresh", async function (req, res) {
	const fetchNewToken = await fetchToken(req.session.refresh_token);
	const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

	req.session.token = fetchNewToken.access_token;
	req.session.date = nextWeekDate;

	return res.status(403).send({ message: "Unauthorized" });
});

app.get("/expired", async function (req, res) {
	const todayDate = new Date();
	const sessionExpirationDate = new Date(req.session.date);

	if (todayDate > sessionExpirationDate) {
		return res.send(true);
	} else {
		return res.send(false);
	}
});

app.get("/authed", async function (req, res) {
	if (req.session.token) {
		return res.send(true);
	} else {
		return res.send(false);
	}
});

app.get("/logout", async function (req, res) {
	req.session.destroy(null);

	return res.send({ message: "Nothing to see here..." });
});

app.get("/stats", async function (req, res) {
	const retrieveUsers: number = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

	const dataObject = {
		users: retrieveUsers,
		servers: client.guilds.cache.size,
	};

	return res.status(200).json({
		message: dataObject,
	});
});

app.get("/me", async function (req, res) {
	const userResult = await fetch("https://discord.com/api/users/@me", {
		headers: {
			authorization: `Bearer ${req.session.token}`,
		},
	}).then((res) => res.json());

	return res.send(userResult);
});

app.get("/managed", async function (req, res) {
	const managedServersArray = [];

	const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
		headers: {
			authorization: `Bearer ${req.session.token}`,
		},
	});

	if (userGuilds.status !== 200) return res.status(userGuilds.status).send(userGuilds.statusText);

	for (let guild of await userGuilds.json()) {
		const permissionsBitfield: boolean = new BitField(guild.permissions).has("32");
		const isBotInGuild: boolean = client.guilds.resolve(guild.id) != null;

		guild.bot = isBotInGuild;

		if (permissionsBitfield) {
			managedServersArray.push(guild);
		}
	}

	managedServersArray.sort((a) => (a.bot === false ? 1 : -1));

	return res.status(200).send({ managedServersArray });
});

app.get("/manage/:guildId", async function (req, res) {
	const guildId: string = req.params.guildId;
	const guildInfo: Guild = client.guilds.resolve(guildId);

	if (guildInfo == null) {
		return res.status(403).send({ message: "Bot isn't in guild." });
	}

	return res.status(200).send({ guild: guildInfo });
});

app.use((req, res, next) => {
	const error: Error = new Error("404: not found");

	return res.status(404).json({
		message: error.message,
	});
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	log(`Server is up and running at http://localhost:${port}`);
});

async function fetchToken(code: string) {
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
