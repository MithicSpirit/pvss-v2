import commands from '.';
import getPerms from '../checkPerms';
import { Message, Client } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	let errorDesc = '';
	try {
		const user = message.member;
		if (!args.length) {
			const cmds: string[] = [];
			const perms = await getPerms(user.user, client);
			for (const command of commands)
				if (command[1].perms <= perms) cmds.push(command[1].desc);

			let helpMessage = '';
			cmds.forEach((cmd) => {
				helpMessage += cmd + '\n';
			});
			helpMessage = helpMessage.trim();
			return helpMessage;
		} else if (args.length === 1) {
			const cmd = args[0];
			if (commands.has(cmd)) {
				const description = commands.get(cmd).help;
				return description;
			} else {
				errorPoint = 1;
				errorDesc = cmd;
				throw 'Command not found.';
			}
		} else {
			errorPoint = 2;
			throw 'Invalid syntax';
		}
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Command \`${errorDesc}\` not found.`;
			case 2:
				return `Invalid syntax. Please use \`${prefix}help help\` for more information.`;
		}
	}
};

const perms = 1;

const help = `\`${prefix}help\`
Prints out a list of all commands you have the necessary permissions to utilize and a basic description of each.

\`${prefix}help <command_name>\`
Provides more in-depth information on the command \`<command_name>\`.`;

const desc = `\`${prefix}help [command_name]\`: Provides information about commands.`;

export default {
	run,
	help,
	perms,
	desc,
};
