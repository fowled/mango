// Commande de modération

exports.run = async (client, message, args, tools) => {
    if (message.content.startsWith("!mute")) {
        let memberToMute = message.mentions.members.first();
        let muteRole = message.guild.roles.find(r => r.name === "muted");

        if (muteRole != null /*&& !userToMute.has(muteRole.id)*/) {
            memberToMute.addRole(muteRole).then(memberToMute.roles.forEach(role => memberToMute.removeRole(role))).then(message.reply(`Le rôle *muted* a été ajouté à **${memberToMute}**, il ne devrait plus avoir le droit à l'expression. Triste vie.`)).catch();/*
     */ } else if (muteRole == null /*&& !userToMute.has(muteRole.id)*/) {
            message.guild.createRole({
                name: "muted",
                position: 1,
                permissions: ["READ_MESSAGES"],
            });
            memberToMute.addRole(muteRole);
            message.reply(`Le rôle *muted* a été ajouté à **${memberToMute}**, il ne devrait plus avoir le droit à l'expression. Triste vie.`);
        /*} else if (userToMute.has(muteRole.id)) {
            userToMute.removeRole(muteRole).catch(message.reply("Oups, une erreur innatendue est survenue. Une patrouille de cookies virtuels va vous venir en aide.") + console.log(error)).then(message.reply("Rôle enlevé à l'utilisateur..."));
        */}
    }
}