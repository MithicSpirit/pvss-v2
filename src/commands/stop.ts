import { prefix } from '../../config.json';
import mgr from '../valueManager';

const run = (args: string[], info): string => {
	if (args.length != 0)
		return `Invalid syntax. Please use \`${prefix}help stop\` for more information.`;

	const channel = info.message.channel.type;
	if (channel != 'DM') return `\`${prefix}stop\` must be DMd to the bot.`;

	mgr.backup();
	info.message.reply('Bot stopping.');
	info.client.destroy();
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
