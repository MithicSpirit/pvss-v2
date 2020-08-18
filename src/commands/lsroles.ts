import { Message, Client, Role, RoleManager } from 'discord.js';
import { config } from '../config';
const { guildID, prefix } = config;

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	let errorDesc = '';
	try {
		let minMembers = 0;
		let useFilter = true;
		if (args.length > 1) {
			errorPoint = 1;
			throw 'Invalid syntax.';
		} else if (args.length == 1) {
			minMembers = Number(args.pop());
			if (isNaN(minMembers)) {
				errorPoint = 1;
				throw 'Invalid syntax.';
			} else if (minMembers == -1) useFilter = false;
		}

		const filter = (role: Role): boolean => {
			return role.members.size <= minMembers;
		};

		const roles: RoleManager = (await client.guilds.fetch(guildID)).roles;

		let roleList = (await roles.fetch()).cache
			.filter((role: Role) => role.name !== '@everyone')
			.sort(
				(role1: Role, role2: Role, name1, name2): number =>
					role1.members.size - role2.members.size,
			);
		if (useFilter) roleList = roleList.filter(filter);

		if (!roleList.size) {
			errorPoint = 2;
			errorDesc = String(minMembers);
			throw 'No matching roles.';
		}

		let out = '';
		for (const role of roleList.values()) {
			out += `\`${role.name}\`: ${role.members.size}\n`;
		}
		return out.trim();
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid syntax. Please use \`${prefix}help run\` for more information.`;
			case 2:
				return `No roles found with ${errorDesc} or fewer members.`;
		}
	}
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
