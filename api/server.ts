import { Sequelize } from "sequelize";
import { Client } from "discord.js";
import express, { urlencoded, json } from "express";
import SequelizeSession from "connect-session-sequelize";
import session from "express-session";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";

import { log } from "../src/utils/Logger";

import { getUser, getGuilds } from "./utils/requests";
import { registerRoutes } from "./utils/routes";

let refreshes = 0;

export async function createAPIServer(client: Client, database: Sequelize) {
	const SequelizeStore = SequelizeSession(session.Store);
	const store = new SequelizeStore({ db: database, table: "sessions" });

	const app = express();

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
		log(`${chalk.yellow("started server")} at ${chalk.cyan(`http://localhost:${process.env.PORT}`)}`);
	});

	setInterval(async function () {
		await refreshCache(client, database);
	}, 60 * 5 * 1000);
}

async function refreshCache(client: Client, database: Sequelize) {
	const userIDs: string[] = [];
	const sessionModel = database.model("sessions");

	(await sessionModel.findAll()).forEach(async (elm) => {
		const getData = elm.get("data") as { token: string; user: { id: string } };

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

	if (refreshes > 0) {
		process.stdout.moveCursor(0, -1);
		process.stdout.clearScreenDown();
	}

	log(`refreshed ${chalk.greenBright("cache")} ${chalk.cyanBright(`(x${refreshes++})`)}`);
}
