const DISCORD = require("discord.js");
const BOT = new DISCORD.Client();
var date = new Date;

// Commande d'amusement

exports.run = (BOT, message, args, tools) => {
    let tableauHeures = date.toLocaleTimeString(); // date.toLocaleTimeString() pour avoir l'heure, les minutes et les secondes
    message.reply(tableauHeures);
}