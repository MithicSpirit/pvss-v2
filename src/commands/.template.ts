import { Message, Client } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	try {
		if (args.length < 0)
			// MIN ARGUMENT LENGTH
			return `Invalid syntax. Please use \`${prefix}help NAME\` for more information.`;

		return; // Return message
	} catch (error) {
		console.error(error);
		return 'Internal error. Please check logs for more information.';
	}
};

const perms = Infinity; // Perm level from src/checkPerms.ts

const help = `\`${prefix}NAME <MANDATORY> [OPTIONAL]\`
EXTENSIVE DESCRIPTION

\`${prefix}NAME <MANDATORY> [OPTIONAL]\`
EXTENSIVE DESCRIPTION`;

const desc = `\`${prefix}NAME <MANDATORY> [OPTIONAL]\`: SHORT DESCRIPTION`;

export default {
	run,
	help,
	perms,
	desc,
};
