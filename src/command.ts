import getPerms from './checkPerms.js';
import 'fs';
import commands from './commands';
import { Message } from 'discord.js';

export default (cmd: string, args: string[], message: Message): string => {
	const command = commands.get(cmd);
	if (command === undefined) throw 'Command DNE';

	if (command.perms > getPerms(message.member))
		return 'Insufficient permissions!';
	else return command.run(args, message);
};
