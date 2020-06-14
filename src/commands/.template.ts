import { Message, Client } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;

const run = (args: string[], message: Message, client: Client): string => {
	if (args.length < 0)
		// MIN ARGUMENT LENGTH
		return `Invalid syntax. Please use \`${prefix}help NAME\` for more information.`;

	return; // Return message
};

const perms = 5; // Perm level from src/checkPerms.ts

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
