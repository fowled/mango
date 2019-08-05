const search = require("yt-search");

exports.run = async (client, message, args, ops) => {
    search(args.join(" "), function (err, res) {
        if (err) return message.reply("Désolé, quelque chose s'est mal passé.");

        let videos = res.videos.slice(0, 1);
        let commandFile = require("./play.js");

        commandFile.run(client, message, [videos[0].url], ops);
    });
}