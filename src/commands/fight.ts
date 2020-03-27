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

    const sentences: string[] = [`was backstabbed by`, "got rekt by", "took the L to", "was fucked up by", "was ALT+F4'd by", "was rm -rf by", "was thrown into a ravine", "was crusaded by the knight"];
    const randomEmoji: string[] = [":crossed_swords:", ":gun:", ":axe:", ":dagger:", "<:gunz:693042886031179826>", "<a:whatthesword:693042890477404170>"];

    const messageID: Discord.Message = (await message.channel.send("1v1 in progress... <:monkaStab:690915494995296340>"));

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
            scenario.push(`${randomEmoji[Math.floor(Math.random() * randomEmoji.length)]} **${P1.tag}** ${sentences[Math.floor(Math.random() * sentences.length) + 0]} **${P2.tag}** and lost *${value}* HP.`);
        }

        scenario.push(`:bomb: Damage received: ${HPLostEachRoundForP1.reduce(reducer)}`);
        scenario.push("> **Opponent's turn!**");

        for (let value of Object.values(HPLostEachRoundForP2)) {
            scenario.push(`${randomEmoji[Math.floor(Math.random() * randomEmoji.length)]} **${P2.tag}** ${sentences[Math.floor(Math.random() * sentences.length) + 0]} **${P1.tag}** and lost *${value}* HP.`);
        }

        scenario.push(`:bomb: Damage received: ${HPLostEachRoundForP2.reduce(reducer)}`);

        const winner = Math.sign(HPLostEachRoundForP1.reduce(reducer) - HPLostEachRoundForP2.reduce(reducer)) == parseInt("-1") ? P1 : P2;

        scenario.push(`:medal: The winner is... **${winner.tag}**!`);

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
