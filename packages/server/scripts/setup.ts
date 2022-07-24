import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";

const questions = [
	{
		type: "input",
		name: "token",
		message: `Enter your ${chalk.greenBright("bot's token")}:`,
	},

	{
		type: "input",
		name: "api_key",
		message: `Enter your ${chalk.greenBright("Hypixel API key")}:`,
	},

	{
		type: "input",
		name: "cmd_channel",
		message: `Enter your ${chalk.greenBright("executed commands log channel")}:`,
	},

	{
		type: "input",
		name: "err_channel",
		message: `Enter your ${chalk.greenBright("errors log channel")}:`,
	},

	{
		type: "input",
		name: "guild_id",
		message: `Enter your ${chalk.greenBright("bot's admin guild id")}:`,
	},
];

async function startPrompt() {
	const prompt = await inquirer.prompt(questions);

	const spinner = createSpinner("Creating an .env file...").start();

	const content = [
		`TOKEN:${prompt.token}`,
		`API_KEY:${prompt.api_key}`,
		`CMD_CHANNEL:${prompt.cmd_channel}`,
		`ERR_CHANNEL:${prompt.err_channel}`,
		`CMD_CHANNEL:${prompt.cmd_channel}`,
		`GUILD_ID:${prompt.guild_id}`,
	].join("\n");

	try {
		fs.writeFileSync(".env", content);
	} catch (err) {
		console.log(err);
	}

	spinner.success();

	console.log(`\n🚀 Setup has finished! You may now start the bot using ${chalk.magenta("npx ts-node src/index.ts")}!`);
}

startPrompt();
