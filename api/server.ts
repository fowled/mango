import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import express, { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import chalk from "chalk";
import cors from "cors";

import type { PrismaClient } from "@prisma/client";
import type { Client } from "discord.js";

import { log } from "../src/utils/Logger";

import { getUser, getGuilds } from "./utils/requests";
import { registerRoutes } from "./utils/routes";

export async function createAPIServer(client: Client, database: PrismaClient) {
	const app = express();

	app.use([
		session({
			secret: process.env.SESSION_SECRET,
			cookie: { secure: !process.env.SECURE_COOKIE },
			resave: false,
			saveUninitialized: false,
			store: new PrismaSessionStore(database, { dbRecordIdIsSessionId: true }),
		}),
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

async function refreshCache(client: Client, database: PrismaClient) {
	const sessions = await database.session.findMany();

	sessions.forEach(async (session) => {
		const parsedData = JSON.parse(session.data);

		if (!parsedData.token) return;

		const fetchUser = await getUser(parsedData.token);
		const fetchManagedGuilds = await getGuilds(parsedData.token, client);

		Object.assign(parsedData, {
			user: fetchUser,
			guilds: fetchManagedGuilds,
		});

		await database.session.update({ where: { id: session.id }, data: { data: JSON.stringify(parsedData) } });
	});
}
