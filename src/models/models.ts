import * as Sequelize from "sequelize";
import { db } from "../index";

export async function defModels() {
	db.define("marketItems", {
		name: {
			type: Sequelize.STRING,
			unique: true,
		},
		price: Sequelize.TEXT,
		sellerID: Sequelize.STRING,
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
	});

	db.define("inventoryItems", {
		name: {
			type: Sequelize.STRING,
			unique: true,
		},
		price: Sequelize.TEXT,
		sellerID: Sequelize.STRING,
		authorID: Sequelize.STRING,
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
	});

	db.define("moneyAcc", {
		idOfUser: Sequelize.STRING,
		money: Sequelize.INTEGER,
	});

	db.define("welChannels", {
		idOfGuild: Sequelize.STRING,
		idOfChannel: Sequelize.STRING,
	});

	db.define("logChannels", {
		idOfGuild: Sequelize.STRING,
		idOfChannel: Sequelize.STRING,
	});

	db.define("birthdaysChannels", {
		idOfGuild: Sequelize.STRING,
		idOfChannel: Sequelize.STRING,
	});

	db.define("birthdays", {
		idOfUser: Sequelize.STRING,
		birthday: Sequelize.STRING,
		birthdayTimestamp: Sequelize.NUMBER,
		idOfGuild: Sequelize.STRING,
	});

	db.define("ranks", {
		idOfUser: Sequelize.STRING,
		xp: Sequelize.INTEGER,
		idOfGuild: Sequelize.INTEGER,
	});

	db.define("sessions", {
		sid: {
			type: Sequelize.STRING(36),
			primaryKey: true,
		},
		expires: Sequelize.DATE,
		data: Sequelize.JSON,
	});
}
