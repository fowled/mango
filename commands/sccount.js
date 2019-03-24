// Commande liée à Scratch

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.run = async (client, message, args, tools) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let responseGoodText = JSON.parse(xhttp.responseText);
            message.channel.send(`**${responseGoodText.count}** projets sont actuellement comptés sur Scratch.`);
        }
    };

    xhttp.open("GET", "https://api.scratch.mit.edu/projects/count/all", true);
    xhttp.send();
}