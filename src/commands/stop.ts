import mgr from '../valueManager';
import { Message, Client } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	try {
		if (args.length != 0) {
			errorPoint = 1;
			throw 'Invalid syntax.';
		}

		const channel = message.channel.type;
		if (channel != 'dm') {
			errorPoint = 2;
			throw 'Must be DM.';
		}

		mgr.backup();
		await message.channel.send('Bot stopping.');
		client.destroy();
		process.exit(0);
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid syntax. Please use \`${prefix}help stop\` for more information.`;
			case 2:
				return `\`${prefix}stop\` must be DMd to the bot.`;
		}
	}
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
