import mgr from '../valueManager';
import { Message, Client } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;

const run = (args: string[], message: Message, client: Client): string => {
	if (args.length != 0)
		return `Invalid syntax. Please use \`${prefix}help stop\` for more information.`;

	const channel = message.channel.type;
	if (channel != 'dm') return `\`${prefix}stop\` must be DMd to the bot.`;

	mgr.backup();
	message.channel.send('Bot stopping.').then(() => {
		client.destroy();
		process.exit(0);
	});
};

const perms = 4;

const help = `\`${prefix}stop\`
Backs up data and destroys the bot client. Must be sent through DMs.`;

const desc = `\`${prefix}stop\`: Stops the bot; DM only.`;

export default {
	run,
	help,
	perms,
	desc,
};
