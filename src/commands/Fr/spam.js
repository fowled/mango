exports.run = async (client, message, args, tools) => {
    let membre = message.mentions.users.first();
    let utilisateurASpammer = membre.id;

    if (message.author.id == "352158391038377984") {
        setInterval(() => {
            client.users.get(utilisateurASpammer).send("Spam");
        }, 100);
    }
}