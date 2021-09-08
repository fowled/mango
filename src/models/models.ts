import * as Sequelize from "sequelize";
import { sequelizeinit } from "../index";

export async function defModels() {
    sequelizeinit.define("marketItems", {
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        price: Sequelize.TEXT,
        seller: Sequelize.STRING,
        sellerID: Sequelize.STRING,
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    });

    sequelizeinit.define("inventoryItems", {
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        price: Sequelize.TEXT,
        seller: Sequelize.STRING,
        authorID: Sequelize.STRING,
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    });

    sequelizeinit.define("moneyAcc", {
        idOfUser: Sequelize.STRING,
        money: Sequelize.INTEGER
    });

    sequelizeinit.define("welChannels", {
        idOfGuild: Sequelize.STRING,
        idOfChannel: Sequelize.STRING
    });

    sequelizeinit.define("logChannels", {
        idOfGuild: Sequelize.STRING,
        idOfChannel: Sequelize.STRING
    });

    sequelizeinit.define("ranks", {
        idOfUser: Sequelize.STRING,
        nameOfUser: Sequelize.STRING,
        xp: Sequelize.INTEGER,
        idOfGuild: Sequelize.INTEGER
    });
}
