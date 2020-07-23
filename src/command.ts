import getPerms from './checkPerms';
import 'fs';
import commands from './commands';
import { Message, Client } from 'discord.js';

export default (
	cmd: string,
	args: string[],
	message: Message,
	client: Client,
): string => {
	const command = commands.get(cmd);
	if (command === undefined) throw 'Command DNE';

	if (command.perms > getPerms(message.author, client))
		return 'Insufficient permissions!';
	else return command.run(args, message, client);
};
