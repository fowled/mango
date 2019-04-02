exports.run = async (client, message, args, ops) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (days == 0) {
        message.reply(`Le bot est en ligne depuis ${hours} heure(s), ${minutes} minute(s) et ${seconds.toFixed()} seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    } else if (days == 1) {
        message.reply(`Le bot est en ligne depuis ${days} jour, ${hours} heure(s), ${minutes} minute(s) et ${seconds.toFixed()} seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    } else if (days > 1) {
        message.reply(`Le bot est en ligne depuis ${days} jours, ${hours} heure(s), ${minutes} minute(s) et ${seconds.toFixed()} seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    }
}