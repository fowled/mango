import * as Discord from "discord.js";

// Fun command

/**
 * FIGHT! 1vs1 between 2 users
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    const P1: Discord.User = message.member.user;
    const P2: Discord.User = message.mentions.users.first() ? message.mentions.users.first() : message.member.guild.members.random().user;

    let scenario: string[] = [];
    let scenarioHP: number;
    let HPLostEachRoundForP1: number[] = [];
    let HPLostEachRoundForP2: number[] = [];

    const sentences: string[] = [`s'est fait taper dessus par`, "a reçu le poing dans sa figure de la part de", "a été mordu par", "s'est fait agresser par", "s'est fait enculer par", "s'est fait chier dessus par", "a été converti à l'islam par", "est devenu membre de Daesh à cause de"];
    const randomEmoji: string[] = [":crossed_swords:", ":gun:", ":axe:", ":dagger:"];

    const messageID: Discord.Message = (await message.channel.send("Octogone en cours..."));

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateScenario();

    for (let value of Object.values(scenario)) {
        await sleep(2000);
        messageID.edit(messageID.content += `\n${value}`);
    }

    function generateScenario() {
        PlayerOneLostHP();
        PlayerTwoLostHP();

        const reducer = (accumulator: any, currentValue: any) => accumulator + currentValue;

        for (let value of Object.values(HPLostEachRoundForP1)) {
            scenario.push(`${randomEmoji[Math.floor(Math.random() * randomEmoji.length)]} **${P1.tag}** ${sentences[Math.floor(Math.random() * sentences.length) + 0]} **${P2.tag}** et a perdu *${value}* HP.`);
        }

        scenario.push(`:bomb: Dégâts reçus: ${HPLostEachRoundForP1.reduce(reducer)}`);
        scenario.push("`========= Passons maintenant à l'adversaire ! =========`");

        for (let value of Object.values(HPLostEachRoundForP2)) {
            scenario.push(`${randomEmoji[Math.floor(Math.random() * randomEmoji.length)]} **${P2.tag}** ${sentences[Math.floor(Math.random() * sentences.length) + 0]} **${P1.tag}** et a perdu *${value}* HP.`);
        }

        scenario.push(`:bomb: Dégâts reçus: ${HPLostEachRoundForP2.reduce(reducer)}`);

        const winner = Math.sign(HPLostEachRoundForP1.reduce(reducer) - HPLostEachRoundForP2.reduce(reducer)) == parseInt("-1") ? P1 : P2;

        scenario.push(`:medal: Le gagnant est... ${winner}`);

        return scenario;
    }

    async function PlayerOneLostHP() {
        scenarioHP = 0;
        let randomNumber: number;

        while (scenarioHP <= 99) {
            randomNumber = Math.floor(Math.random() * 30) + 10;
            scenarioHP += randomNumber;
            HPLostEachRoundForP1.push(randomNumber);
        }
        scenarioHP -= scenarioHP - 100;
    }

    async function PlayerTwoLostHP() {
        scenarioHP = 0;
        let randomNumber: number;

        while (scenarioHP <= 99) {
            randomNumber = Math.floor(Math.random() * 30) + 10;
            scenarioHP += randomNumber;
            HPLostEachRoundForP2.push(randomNumber);
        }
        scenarioHP -= scenarioHP - 100;
    }
}
