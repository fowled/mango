const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Scratch command

exports.run = async (client, message, args, tools) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let parsedRequest = JSON.parse(xhttp.responseText);
            message.channel.send(`**${parsedRequest.count}** projects are actually shared on the Scratch website. Meow!`);
        }
    };

    xhttp.open("GET", "https://api.scratch.mit.edu/projects/count/all", true);
    xhttp.send();
}