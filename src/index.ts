import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

import * as Binder from "./utils/EventsBinder";

import { Token } from "./token";

export const Client: Discord.Client = new Discord.Client();

export const talkedRecently = new Set();
export const queue = new Map();
export const sequelizeinit = new Sequelize.Sequelize("database", "username", "password", {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${process.cwd()}/database/db.sqlite`,
});

Client.on('error', console.error);

(async () => {
	await Binder.bind(Client);
	Client.login(Token);
})();
