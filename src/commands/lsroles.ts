import { Message, Client, Role, RoleManager } from 'discord.js';
import { config } from '../config';
const { guildID, prefix } = config;

const run = (args: string[], message: Message, client: Client): string => {
	let minMembers = 0;
	if (args.length > 1)
		return `Invalid syntax. Please use \`${prefix}help run\` for more information.`;
	else if (args.length == 1) minMembers = Number(args.pop());
	if (isNaN(minMembers))
		return `Invalid syntax. Please use \`${prefix}help run\` for more information.`;

	const filter = (role: Role): boolean => {
		return role.members.size <= minMembers;
	};

	const roles: RoleManager = client.guilds.resolve(guildID).roles;

	const roleList = roles.cache
		.filter(filter)
		.sort(
			(role1: Role, role2: Role, name1, name2): number =>
				role1.members.size - role2.members.size,
		);
	if (!roleList) return 'No roles found.';

	let out = '';
	for (const role of roleList.values()) {
		out += `\`@${role.name}\`: ${role.members.size}\n`;
	}

	return out.trim();
};

const perms = 1;

const help = `\`${prefix}lsroles [min]\`
List all roles with fewer than \`min\` members. \`min\` defaults to 0.
Set \`min\` to \`-1\` to list all roles.`;

const desc = `\`${prefix}lsroles [min]\`: List all roles with none (or fewer than \`min\`) members.`;

export default {
	run,
	help,
	perms,
	desc,
};
