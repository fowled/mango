import express, { Express, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { Guild, BitField } from "discord.js";
import { URLSearchParams } from "url";

import { log } from "../src/utils/Logger";
import { client } from "../src/index";

const app: Express = express();

declare module "express-session" {
    interface SessionData {
        token: string;
        refresh_token: string;
    }
}

app.use(session({ secret: process.env.SESSION_SECRET, cookie: { secure: false }, resave: false, saveUninitialized: true }));

app.use(urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
}));

app.get("/api", async function (req, res) {      
    return res.send({ message: "Welcome to Mango's API!" });
});

app.get("/api/token", async function (req, res) {
    const code: string = req.query.code as string;

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
    });

    const parseResponse = await fetchToken.json();

    req.session.token = parseResponse.access_token;
    req.session.refresh_token = parseResponse.refresh_token;

    return res.send({ message: "Unauthorized" });
});

app.get("/api/authed", async function (req, res) {
    if (req.session.token) {
        return res.send(true);
    } else {
        return res.send(false);
    }
});

app.get("/api/stats", async function (req, res) {
    const retrieveUsers: number = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const dataObject = {
        users: retrieveUsers,
        servers: client.guilds.cache.size
    }

    return res.status(200).json({
        message: dataObject
    });
});

app.get("/api/me", async function (req, res) {
    const userResult = await fetch("https://discord.com/api/users/@me", {
        headers: {
            authorization: `Bearer ${req.session.token}`,
        },
    }).then((res => res.json()));

    return res.send(userResult);
});

app.get("/api/managed", async function (req, res) {
    const managedServersArray: {}[] = [];
    const botNotInGuild: {}[] = [];

    const userGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
            authorization: `Bearer ${req.session.token}`
        }
    });

    if (userGuilds.status !== 200) return res.status(userGuilds.status).send(userGuilds.statusText);

    for (let guild of await userGuilds.json()) {
        const permissionsBitfield: boolean = new BitField(guild.permissions).has("32");
        const isBotInGuild: boolean = client.guilds.resolve(guild.id) != null;

        if (permissionsBitfield && isBotInGuild) {
            managedServersArray.push(guild);
        } else if (permissionsBitfield) {
            botNotInGuild.push(guild);
        }
    }

    return res.status(200).send({ managedServersArray, botNotInGuild });
});

app.get("/api/manage/:guildId", async function (req, res) {
    const guildId: string = req.params.guildId;
    const guildInfo: Guild = client.guilds.resolve(guildId);

    if (guildInfo == null) {
        return res.status(403).send({ message: "403: Unauthorized - bot isn't in guild." });
    }

    return res.status(200).send({ guild: guildInfo });
});

app.use((req, res, next) => {
    const error: Error = new Error("404: not found");

    return res.status(404).json({
        message: error.message
    });
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    log(`Server is up and running at http://localhost:${port}`);
});
