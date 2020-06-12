import mgr from '../valueManager';
import { Message } from 'discord.js';
import { client } from '../bot';
import { config } from '../bot';
const prefix = config.prefix;

const run = (args: string[], message: Message): string => {
	if (args.length != 0)
		return `Invalid syntax. Please use \`${prefix}help stop\` for more information.`;

	const channel = message.channel.type;
	if (channel != 'dm') return `\`${prefix}stop\` must be DMd to the bot.`;

	mgr.backup();
	message.channel.send('Bot stopping.');
	client.destroy();
	return;
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
