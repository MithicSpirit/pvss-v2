import getPerms from './checkPerms';
import 'fs';
import commands from './commands';
import { Message, Client } from 'discord.js';

export default async (
	cmd: string,
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	const command = commands.get(cmd);
	if (command === undefined)
		return `The command \`${cmd}\` does not exist. Please use \`.help\` for a list of available commands.`;

	if (command.perms > (await getPerms(message.author, client)))
		return 'Insufficient permissions!';
	else return command.run(args, message, client);
};
