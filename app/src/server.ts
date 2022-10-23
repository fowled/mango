import express, { urlencoded, json, Request, Response, NextFunction } from "express";
import { PrismaSessionStore } from "@mazzlabs/prisma-session-store-fix";
import { Client, BitField } from "discord.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import fetch from "node-fetch";
import chalk from "chalk";
import cors from "cors";

import type { PrismaClient } from "@prisma/client";

import { User, Guild } from "@website/types/interfaces";

import { log } from "utils/logger";

declare module "express-session" {
    interface SessionData {
        token: string;
        refresh_token: string;
        user: User;
        guilds: Guild[];
        date: Date;
    }
}

export async function createAPIServer(client: Client, database: PrismaClient) {
    const app = express();

    app.use([
        session({
            secret: process.env.SESSION_SECRET,
            cookie: {
                secure: !process.env.SECURE_COOKIE,
                maxAge: 24 * 60 * 60 * 7 * 1000 * 4,
                httpOnly: true,
            },
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

    app.listen(process.env.PORT, () => {
        log(`${chalk.yellow("started server")} at ${chalk.cyan(`http://localhost:${process.env.PORT}`)}`);
    });

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
        const findSession = await database.session.findUnique({
            where: { sid: req.session.id },
        });
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
        if (client.guilds.resolve(req.params.guildId) === null) {
            return res.status(403).send({ message: "Bot isn't in guild." });
        }

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

    async function fetchNewToken(refresh_token: string) {
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

    async function getUser(token: string) {
        const userResult = await fetch("https://discord.com/api/users/@me", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());

        return userResult;
    }

    async function getGuilds(token: string, client: Client) {
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

    async function getStats(client: Client) {
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

    async function manageGuild(guildId: string, client: Client) {
        const [welcomeChannel, birthdaysChannel] = await Promise.all([
            await database.welChannels.findUnique({ where: { idOfGuild: guildId } }),
            await database.birthdaysChannels.findUnique({
                where: { idOfGuild: guildId },
            }),
        ]);

        const guild = client.guilds.resolve(guildId);

        Object.assign(guild, {
            welcome: welcomeChannel?.idOfChannel ?? "unspecified",
            birthdays: birthdaysChannel?.idOfChannel ?? "unspecified",
        });

        return guild;
    }

    async function hasTokenExpired(req: Request, _res: Response, next: NextFunction) {
        const todayDate = new Date();
        const sessionExpirationDate = new Date(req.session.date);

        if (todayDate > sessionExpirationDate) {
            await refreshToken(req);
        }

        return next();
    }

    async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
        if (!req.session.token) {
            return res.status(403).send({ message: "Unauthorized" });
        } else {
            return next();
        }
    }

    async function refreshToken(req: Request) {
        const fetchToken = await fetchNewToken(req.session.refresh_token);
        const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

        Object.assign(req.session, {
            token: fetchToken.access_token,
            refresh_token: fetchToken.refresh_token,
            date: nextWeekDate,
        });
    }
}
