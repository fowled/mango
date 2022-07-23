import { PrismaSessionStore } from "@mazzlabs/prisma-session-store-fix";
import express, { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import chalk from "chalk";
import cors from "cors";

import type { PrismaClient } from "@prisma/client";
import type { Client } from "discord.js";

import { log } from "../src/utils/Logger";

import { registerRoutes } from "./utils/routes";

export async function createAPIServer(client: Client, database: PrismaClient) {
	const app = express();

	app.use([
		session({
			secret: process.env.SESSION_SECRET,
			cookie: { secure: false, maxAge: 10 * 60 * 1000, httpOnly: false },
			resave: false,
			saveUninitialized: false,
			rolling: false,
			store: new PrismaSessionStore(database, { loggerLevel: "log" }),
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

	await registerRoutes(app, client, database);

	app.listen(process.env.PORT, () => {
		log(`${chalk.yellow("started server")} at ${chalk.cyan(`http://localhost:${process.env.PORT}`)}`);
	});
}
