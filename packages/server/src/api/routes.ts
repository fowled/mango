import { Express, Request, Response } from "express";
import { Client } from "discord.js";

import type { PrismaClient } from "@prisma/client";

import { hasTokenExpired, isLoggedIn } from "../utils/manager";

import { fetchToken, getUser, getGuilds, getStats, manageGuild } from "../utils/requests";

export async function registerRoutes(app: Express, client: Client, database: PrismaClient) {
	app.get("/", async function (_req: Request, res: Response) {
		return res.send({ message: "Welcome to Mango's API!" });
	});

	app.get("/callback", async function (req: Request, res: Response) {
		const code: string = req.query.code as string;

		const getToken = await fetchToken(code);
		const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

		Object.assign(req.session, {
			token: getToken.access_token,
			refresh_token: getToken.refresh_token,
			date: nextWeekDate,
			user: await getUser(getToken.access_token),
			guilds: await getGuilds(getToken.access_token, client),
			lastEdited: new Date(),
		});

		return res.redirect(process.env.PRODUCTION_URI);
	});

	app.get("/user", isLoggedIn, hasTokenExpired, async function (req: Request, res: Response) {
		const user = req.session.user;

		return res.status(200).send(user);
	});

	app.get("/guilds", isLoggedIn, async function (req: Request, res: Response) {
		const findSession = await database.session.findUnique({ where: { sid: req.session.id } });
		const parseSessionData = JSON.parse(findSession.data);

		const parseDate = new Date(parseSessionData.lastEdited);
		const calculateTime = new Date(parseDate.getTime() + 5 * 60000);

		let guilds: object[];

		if (new Date() > calculateTime) {
			guilds = await getGuilds(req.session.token, client);

			Object.assign(req.session, {
				guilds,
				lastEdited: new Date(),
			});
		} else {
			guilds = req.session.guilds;
		}

		return res.status(200).send(guilds);
	});

	app.get("/manage/:guildId", isLoggedIn, async function (req: Request, res: Response) {
		return res.status(200).send(await manageGuild(req.params.guildId, client));
	});

	app.get("/logout", isLoggedIn, async function (req: Request, res: Response) {
		req.session.destroy(null);

		return res.send({ message: "Nothing to see here..." });
	});

	app.get("/stats", async function (_req: Request, res: Response) {
		return res.send(await getStats(client));
	});

	app.get("*", async function (_req: Request, res: Response) {
		return res.status(404).json({
			message: "Not found!",
		});
	});
}
