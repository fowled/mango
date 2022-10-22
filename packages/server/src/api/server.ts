import { PrismaSessionStore as PSS } from '@mazzlabs/prisma-session-store-fix';
import express, { urlencoded, json } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import chalk from 'chalk';
import cors from 'cors';

import type { PrismaClient } from '@prisma/client';
import type { Client } from 'discord.js';

import { User, Guild } from '@client/types/interfaces';

import { log } from 'utils/logger';

import { registerRoutes } from './routes';

declare module 'express-session' {
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
            store: new PSS(database, { loggerLevel: 'log' }),
        }),
        urlencoded({ extended: true }),
        json(),
        cookieParser(),
        cors({
            origin: [process.env.PRODUCTION_URI],
            credentials: true,
            exposedHeaders: ['set-cookie'],
        }),
    ]);

    await registerRoutes(app, client, database);

    app.listen(process.env.PORT, () => {
        log(`${chalk.yellow('started server')} at ${chalk.cyan(`http://localhost:${process.env.PORT}`)}`);
    });
}
