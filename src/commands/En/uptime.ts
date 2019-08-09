exports.run = async (client, message, args, ops) => {
    let totalSeconds = (client.uptime / 1000);
    let days: number = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (days === 0) {
        message.reply(`Le bot est en ligne depuis **${Math.round(hours)}** heure(s), **${Math.round(minutes)}** minute(s) et **${Math.round(seconds)}** seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    } else if (days === 1) {
        message.reply(`Le bot est en ligne depuis **${Math.round(days)}** jour, **${Math.round(hours - (24))}** heure(s), **${Math.round(minutes)}** minute(s) et **${Math.round(seconds)}** seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    } else if (days !== 1) {
        message.reply(`Le bot est en ligne depuis **${Math.round(days)}** jours, **${Math.round(hours - (days * 24))}** heure(s), ${Math.round(minutes)} minute(s) et **${Math.round(seconds)}** seconde(s). Il est hébergé sur le Raspberry Pi de son propriétaire.`);
    }
}