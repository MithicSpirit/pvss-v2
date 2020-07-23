import {
	Role,
	Snowflake,
	Client,
	Guild,
	Message,
	GuildMember,
} from 'discord.js';
import { config } from '../config';
import fs from 'fs';

const prefix = config.prefix;
const categories = config.roleCategories;

export interface Backup {
	filters: string[];
	members: {
		id: Snowflake;
		nick?: string;
		roles: Record<string, Snowflake[]>;
	}[];
}

const getCategory = (role: Role, guild: Guild): string => {
	let last: string;
	for (const i of categories) {
		const compare = guild.roles.resolve(i.id).comparePositionTo(role);
		if (compare > 0) last = i.name;
		else if (compare === 0) return i.name;
		else return last;
	}
	return last;
};

const createBackup = (
	args: string[],
	message: Message,
	client: Client,
): string => {
	const guild = client.guilds.resolve(config.guildID);
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
				const cat = getCategory(j[1], guild);
				if (filters.length && !filters.includes(cat)) continue;
				if (!member.roles[cat]) member.roles[cat] = [];
				member.roles[cat].push(j[1].id);
			}

			if (filters.length || filters.includes('nicks')) {
				member['nick'] = i[1].nickname;
			}

			backup.members.push(member);
		} catch (e) {
			console.error(e);
			return `Error while backing up <@${i[1].id}>.`;
		}
	}

	if (!backup.filters.length) {
		for (const i of categories) backup.filters.push(i.name);
		backup.filters.push('nicks');
	}

	const date = new Date();
	const fileName =
		`${date.getUTCFullYear()}.${date.getUTCMonth()}.${date.getUTCDay()}` +
		`${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}` +
		`.${date.getUTCMilliseconds()}`;

	fs.writeFileSync(
		`./backups/${fileName}.json`,
		JSON.stringify(backup),
		'utf8',
	);

	return `Backup \`${fileName}\` completed!`;
};

const listBackups = (
	args: string[],
	message: Message,
	client: Client,
): string => {
	const fileList = fs.readdirSync('./backups/', 'utf8');
	if (args.length) {
		fileList.filter((file) => {
			const types: string[] = JSON.parse(
				fs.readFileSync(`./backups/${file}`, 'utf8'),
			).filters;

			let all = true;
			for (const type of args) {
				if (!types.includes(type)) all = false;
			}
			return all;
		});
	}
	if (fileList.length) {
		let result = '';
		for (const i of fileList) result += i.slice(0, -4) + '\n';
		return result.trim();
	}
	return 'No results found.';
};

const backupInfo = (
	args: string[],
	message: Message,
	client: Client,
): string => {
	if (args.length !== 1)
		return `Invalid syntax. Please use \`${prefix}help backup\` for more information.`;

	const fileName = args[0];
	let file: string;
	try {
		file = fs.readFileSync(`./backups/${fileName}.json`, 'utf8');
	} catch (e) {
		console.error(e);
		return `Backup \`${fileName}\` not found. Please use \`${prefix}backup list\` for a list of backups.`;
	}
	const backup: Backup = JSON.parse(file);

	let msg = `\`${fileName}\`:`;
	for (const i of backup.filters) {
		msg += '\n  `' + i + '`';
	}
	return msg.trim();
};

const applyBackup = (
	args: string[],
	message: Message,
	client: Client,
): string => {
	const guild = client.guilds.resolve(config.guildID);
	const fileName = args.shift();
	let file: string;
	try {
		file = fs.readFileSync(`./backups/${fileName}.json`, 'utf8');
	} catch (e) {
		console.error(e);
		return `Backup \`${fileName}\` not found. Please use \`${prefix}backup list\` for a list of backups.`;
	}
	const backup: Backup = JSON.parse(file);

	for (const filter of args)
		if (!backup.filters.includes(filter))
			return `Backup \`${fileName}\` does not contain all specified filters. View \`${prefix}backup info \`${fileName}\` for a list of present filters.`;

	for (const user of backup.members) {
		let member: GuildMember;
		let stop = false;
		guild.members.fetch(user.id).then(
			(i) => (member = i),
			(e) => {
				console.error(e);
				stop = true;
				message.channel.send(
					`Error fetching user \`${user.id}\`. Will continue.`,
				);
			},
		);
		if (stop) continue;

		for (const filter of args) {
			if (filter !== 'nicks') {
				for (const roleID of user.roles[filter]) {
					let role: Role;
					let stop = false;
					guild.roles.fetch(roleID).then(
						(i) => (role = i),
						(e) => {
							console.error(e);
							stop = true;
							message.channel.send(
								`Error fetching role \`${roleID}\`. Will continue.`,
							);
						},
					);
					if (stop) continue;
					if (!member.manageable || !role.managed || !role.editable) {
						message.channel.send(
							`I lack sufficient permissions to assign <@&${roleID}> to <@${user.id}>. Will continue.`,
						);
						continue;
					}
					member.roles.add(role);
				}
			} else {
				const nick = user.nick;
				if (!nick) continue;
				if (!member.manageable) {
					message.channel.send(
						`I lack sufficient permissions to rename <@${user.id}> to \`${nick}\`. Will continue.`,
					);
					continue;
				}
				member.setNickname(nick);
			}
		}
	}

	return `Finished loading backup \`${fileName}\`.`;
};

const functions: Map<
	string,
	(args: string[], message: Message, client: Client) => string
> = new Map([
	['create', createBackup],
	['list', listBackups],
	['info', backupInfo],
	['apply', applyBackup],
]);

const run = (args: string[], message: Message, client: Client): string => {
	if (args.length < 1)
		return `Invalid syntax. Please use \`${prefix}help backup\` for more information.`;

	const type = args.shift();
	const func = functions[type];
	if (func) return func(args, message, client);
	else
		return `Invalid syntax. Please use \`${prefix}help backup\` for more information.`;
};

const perms = 4; // Perm level from src/checkPerms.ts

let categoryHelpList = '';
for (const i of categories) {
	categoryHelpList += `\`${i.name}\`, `;
}

const help = `\`${prefix}backup create [category] [...]\`
Backs up roles and/or nicknames for all members. What is backed up can be selected with \`category\`.
Supported values for \`category\` are ${categoryHelpList}and \`nicks\`.
This command may take a while to execute.

\`${prefix}backup list [category] [...]\`
Lists available backup names. Results can be filtered with \`category\`.
Supported values for \`category\` are ${categoryHelpList}and \`nicks\`.

\`${prefix}backup info <backup-name>\`
Provides info on what categories are in the backup \`backup-name\`.

\`${prefix}backup apply <backup-name> [category] [...]\`
Loads backup \`backup-name\`. What is loaded can be selected with \`category\`.
Supported values for \`category\` are ${categoryHelpList}and \`nicks\`.
**Warning**: This command can be very verbose with error. It is recommended that the bot is granted maximum permissions (i.e.: role with admin at the top of the role list) to reduce this issue.
This command may also take a while to execute.`;

const desc = `\`${prefix}backup <operation> [category] [...]\`: Manages backups.`;

export default {
	run,
	help,
	perms,
	desc,
};
