import { Message, Role, Snowflake } from 'discord.js';
import { config, client } from '../bot';
import fs from 'fs';

export interface Backup {
	filters: string[];
	members: {
		id: Snowflake;
		nick?: string;
		roles: Record<string, Snowflake[]>;
	}[];
}

const prefix = config.prefix;
const categories = config.roleCategories;
const guild = client.guilds.resolve(config.guildID);

const getCategory = (role: Role): string => {
	let last: string;
	for (const i of categories) {
		const compare = guild.roles.resolve(i.id).comparePositionTo(role);
		if (compare > 0) last = i.name;
		else if (compare === 0) return i.name;
		else return last;
	}
	return last;
};

const run = (args: string[], message: Message): string => {
	const filters: string[] = [];
	for (const i of args) {
		const cat = categories[i];
		if (cat) filters.push(cat);
		else if (i === 'nicks') filters.push('nicks');
		else
			return `Invalid category. Please use \`${prefix}help backup\` for a list of supported categories.`;
	}

	const backup: Backup = { filters, members: [] };
	for (const i of guild.members.cache) {
		try {
			const id = i[0];
			const member = { id, roles: {} };

			const roles = i[1].roles.cache;
			for (const j of roles) {
				const cat = getCategory(j[1]);
				if (filters.length && !filters.includes(cat)) continue;
				if (!member.roles[cat]) member.roles[cat] = [];
				member.roles[cat].push(j[1].id);
			}

			if (filters.length || filters.includes('nicks')) {
				member['nick'] = i[1].nickname;
			}

			backup.members.push(member);
		} catch (e) {
			console.log(e);
			return `Error while backing up <@${i[1].id}>.`;
		}
	}

	const date = new Date();
	const fileName = `${date.getUTCFullYear()}.${date.getUTCMonth()}.${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}.json`;
	fs.writeFile(
		`./backups/${fileName}`,
		JSON.stringify(backup),
		'utf8',
		(error) => {
			if (error) return 'Error while writing backup.';
		},
	);

	return 'Backup completed!';
};

const perms = 4; // Perm level from src/checkPerms.ts

let categoryHelpList = '';
for (const i of categories) {
	categoryHelpList += `\`${i.name}\`, `;
}

const help = `\`${prefix}backup [category] [...]\`
Backs up roles and/or nicknames for all members. What is backed up can be selected with \`category\`
Supported values for \`category\` are ${categoryHelpList}and \`nicks\``;

const desc = `\`${prefix}backup [category] [...]\`: Backs up all members' roles and/or nicknames.`;

export default {
	run,
	help,
	perms,
	desc,
};
