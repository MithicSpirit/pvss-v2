import commands from '.';
import { prefix } from '../../config.json';
import getPerms from '../checkPerms.js';
import { Message, Client } from 'discord.js';

interface CommandInfo {
	message: Message;
	client: Client;
}

const run = (args: string[], info: CommandInfo): string => {
	const user = info.message.member;
	if (!args.length) {
		const cmds: string[] = [];
		const perms = getPerms(user);
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
			const description = commands.get(cmd).desc;
			return description;
		} else return `Command ${cmd} not found`;
	} else
		return `Invalid syntax. Please use \`${prefix}help help\` for more information.`;
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
