import { Sequelize } from "sequelize";
import { Client } from "discord.js";
import express, { Express, urlencoded, json } from "express";
import SequelizeSession from "connect-session-sequelize";
import session from "express-session";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";

import { defModels } from "../src/models/models";

import { log } from "../src/utils/Logger";

import { registerRoutes } from "./utils/routes";
import { getUser, getGuilds } from "./utils/requests";

export async function createAPIServer(client: Client, database: Sequelize) {
	await defModels();

	await database.sync();

	const SequelizeStore = SequelizeSession(session.Store);
	const store = new SequelizeStore({ db: database, table: "sessions" });

	const app: Express = express();

	app.use([
		session({ secret: process.env.SESSION_SECRET, cookie: { secure: !process.env.SECURE_COOKIE }, store: store, resave: false, saveUninitialized: false }),
		urlencoded({ extended: true }),
		json(),
		cookieParser(),
		cors({
			origin: [process.env.PRODUCTION_URI],
			credentials: true,
			exposedHeaders: ["set-cookie"],
		}),
	]);

	await registerRoutes(app, client);

	app.listen(process.env.PORT, () => {
		log(`✨ API server is up and running at ${chalk.cyan(`http://localhost:${process.env.PORT}`)}!`);
	});

	setInterval(async function () {
		await refreshCache(client, database);
	}, 60 * 5 * 1000);
}

async function refreshCache(client: Client, database: Sequelize) {
	const userIDs: string[] = [];
	const sessionModel = database.model("sessions");

	(await sessionModel.findAll()).forEach(async (elm) => {
		const getData: { [key: string]: any } = elm.get("data");

		if (!getData.token || userIDs.includes(getData.user.id)) return;

		userIDs.push(getData.user.id);

		const fetchUser = await getUser(getData.token);
		const fetchManagedGuilds = await getGuilds(getData.token, client);

		Object.assign(getData, {
			user: fetchUser,
			guilds: fetchManagedGuilds,
		});

		await sessionModel.update({ data: getData }, { where: { data: { user: { id: getData.user.id } } } });
	});

	log(`🔄 Just refreshed the ${chalk.greenBright("cache")}!`);
}
