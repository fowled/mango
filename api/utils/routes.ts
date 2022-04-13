import { Express, Request, Response } from "express";
import { Client } from "discord.js";

import { hasTokenExpired } from "./manager";

import { fetchToken, getUser, getGuilds, getStats, manageGuild } from "./requests";

export async function registerRoutes(app: Express, client: Client) {
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
		});

		return res.redirect(process.env.PRODUCTION_URI);
	});

	app.get("/user", hasTokenExpired, async function (req: Request, res: Response) {
		// TODO: interface user

		const user = req.session.user;

		return res.send({ authed: req.session.token ? true : false, user });
	});

	app.get("/guilds", async function (req: Request, res: Response) {
		// TODO: interface guild

		const guilds = req.session.guilds;

		return res.send({ authed: req.session.token ? true : false, guilds });
	});

	app.get("/manage/:guildId", async function (req: Request, res: Response) {
		if (!req.session.token) {
			return res.status(403).send({ message: "Unauthorized" });
		}

		return res.status(200).send({ guild: await manageGuild(req.params.guildId, client) });
	});

	app.get("/logout", async function (req: Request, res: Response) {
		req.session.destroy(null);

		return res.send({ message: "Nothing to see here..." });
	});

	app.get("/stats", async function (_req: Request, res: Response) {
		return res.send({ message: await getStats(client) });
	});

	app.get("*", async function (_req: Request, res: Response) {
		return res.status(404).json({
			message: "Not found!",
		});
	});
}
