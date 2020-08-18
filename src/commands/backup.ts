import { Role, Snowflake, Client, Guild, Message } from 'discord.js';
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

const getCategory = async (role: Role, guild: Guild): Promise<string> => {
	let last: string;
	for (const i of categories) {
		const compare = (await guild.roles.fetch(i.id)).comparePositionTo(role);
		if (compare > 0) last = i.name;
		else if (compare === 0) return i.name;
		else return last;
	}
	return last;
};

const createBackup = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	try {
		const guild = await client.guilds.fetch(config.guildID);
		const filters: string[] = [];
		for (const i of args) {
			const cat = categories.find((j) => j.name === i);
			if (cat) filters.push(cat.name);
			else if (i === 'nicks') filters.push('nicks');
			else {
				errorPoint = 1;
				throw 'Invalid category.';
			}
		}

		const backup: Backup = { filters, members: [] };
		for (const i of await guild.members.fetch()) {
			try {
				const id = i[0];
				const member = { id, roles: {} };

				const roles = i[1].roles.cache;
				for (const j of roles) {
					if (j[1].name === '@everyone') continue;
					const cat = await getCategory(j[1], guild);
					if (filters.length && !filters.includes(cat)) continue;
					if (!member.roles[cat]) member.roles[cat] = [];
					member.roles[cat].push(j[1].id);
				}

				if (!filters.length || filters.includes('nicks')) {
					member['nick'] = i[1].displayName;
				}

				backup.members.push(member);
			} catch (e) {
				message.channel.send(
					`Error while backing up <@${i[1].id}>. Will continue.`,
				);
				continue;
			}
		}

		if (!backup.filters.length) {
			for (const i of categories) backup.filters.push(i.name);
			backup.filters.push('nicks');
		}

		const date = new Date();
		const fileName = date.toISOString();

		fs.writeFileSync(
			`./backups/${fileName}.json`,
			JSON.stringify(backup),
			'utf8',
		);

		return `Backup \`${fileName}\` completed!`;
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid category. Please use \`${prefix}help backup\` for a list of supported categories.`;
		}
	}
};

const listBackups = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	try {
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
			for (const i of fileList) result += `\`${i.slice(0, -5)}\`\n`;
			return result.trim();
		}
		errorPoint = 1;
		throw 'No results.';
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return 'No results found.';
		}
	}
};

const backupInfo = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	let errorDesc = '';
	try {
		if (args.length !== 1) {
			errorPoint = 1;
			throw 'Invalid syntax.';
		}

		const fileName = args[0];

		errorPoint = 2;
		errorDesc = fileName;
		const file = fs.readFileSync(`./backups/${fileName}.json`, 'utf8');
		errorPoint = 0;

		const backup: Backup = JSON.parse(file);

		let msg = `\`${fileName}\`:`;
		for (const i of backup.filters) {
			msg += '\n  `' + i + '`';
		}
		return msg.trim();
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid syntax. Please use \`${prefix}help backup\` for more information.`;
			case 2:
				return `Backup \`${errorDesc}\` not found. Please use \`${prefix}backup list\` for a list of backups.`;
		}
	}
};

const applyBackup = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	let errorDesc = '';
	try {
		const guild = await client.guilds.fetch(config.guildID);
		const fileName = args.shift();

		errorPoint = 1;
		errorDesc = fileName;
		const file = fs.readFileSync(`./backups/${fileName}.json`, 'utf8');
		errorPoint = 0;

		const backup: Backup = JSON.parse(file);

		let filters = [...args];
		for (const filter of filters)
			if (!backup.filters.includes(filter)) {
				errorPoint = 2;
				errorDesc = fileName;
				throw 'Missing filters.';
			}
		if (!filters.length) {
			filters = backup.filters;
		}

		for (const user of backup.members) {
			try {
				errorPoint = 3;
				errorDesc = user.id;
				const member = await guild.members.fetch(user.id);
				errorPoint = 0;

				for (const filter of filters) {
					if (filter !== 'nicks') {
						for (const roleID of user.roles[filter]) {
							try {
								errorPoint = 4;
								errorDesc = roleID;
								const role = await guild.roles.fetch(roleID);
								errorPoint = 0;

								if (!member.manageable || !role.editable) {
									errorPoint = 5;
									errorDesc = role.name;
									throw 'Insufficient permissions to assign role.';
								} else errorPoint = 6;
								errorDesc = role.name;
								member.roles.add(role);
								errorPoint = 0;
							} catch (error) {
								switch (errorPoint) {
									default:
										throw error;
									case 4:
										errorPoint = 0;
										message.channel.send(
											`Error fetching role \`${errorDesc}\`. Will continue.`,
										);
										continue;
									case 5:
										errorPoint = 0;
										message.channel.send(
											`I lack sufficient permissions to assign \`${errorDesc}\` to <@${user.id}>. Will continue.`,
										);
										continue;
									case 6:
										errorPoint = 0;
										message.channel.send(
											`Error assigning role \`${errorDesc}\` to <@${user.id}>. Will continue.`,
										);
										continue;
								}
							}
						}
					} else {
						try {
							const nick = user.nick;
							if (!nick) {
								errorPoint = 7;
								throw 'No nickname.';
							}
							if (!member.manageable) {
								errorPoint = 8;
								errorDesc = nick;
								throw 'Insufficient permissions to rename.';
							}
							member.setNickname(nick);
						} catch (error) {
							switch (errorPoint) {
								default:
									throw error;
								case 7:
									errorPoint = 0;
									continue;
								case 8:
									errorPoint = 0;
									message.channel.send(
										`I lack sufficient permissions to rename <@${user.id}> to \`${errorDesc}\`. Will continue.`,
									);
									continue;
							}
						}
					}
				}
			} catch (error) {
				switch (errorPoint) {
					default:
						throw error;
					case 3:
						errorPoint = 0;
						message.channel.send(
							`Error fetching user \`${errorDesc}\`. Will continue.`,
						);
						continue;
				}
			}
		}

		return `Backup \`${fileName}\` applied.`;
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Backup \`${errorDesc}\` not found. Please use \`${prefix}backup list\` for a list of backups.`;
			case 2:
				return `Backup \`${errorDesc}\` does not contain all specified filters. View \`${prefix}backup info \`${errorDesc}\` for a list of present filters.`;
		}
	}
};

const functions: Map<
	string,
	(args: string[], message: Message, client: Client) => Promise<string>
> = new Map([
	['create', createBackup],
	['list', listBackups],
	['info', backupInfo],
	['apply', applyBackup],
]);

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	try {
		if (args.length < 1) {
			errorPoint = 1;
			throw 'Invalid syntax.';
		}

		const type = args.shift();
		const func = functions.get(type);
		if (func) return func(args, message, client);
		else {
			errorPoint = 1;
			throw 'Invalid syntax.';
		}
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid syntax. Please use \`${prefix}help backup\` for more information.`;
		}
	}
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
