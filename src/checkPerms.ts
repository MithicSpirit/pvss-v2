/*
Permission levels:
0 = @everyone
1 = STUDENTS
2 = Trusted Perms
3 = MOD
4 = MEGAMOD, admin
5 = Server owner
*/

import { GuildMember, User, Client } from 'discord.js';
import { config } from './config';
const hierarchy = config.roleHierarchy;

const getHierarchyLvl = (member: GuildMember): number => {
	const memberRoles = member.roles.cache;
	const permLvl = memberRoles.reduce(
		(total, current) => Math.max(total, hierarchy[current.id]),
		0,
	);
	return permLvl;
};

export default async (user: User, client: Client): Promise<number> => {
	const guild = await client.guilds.fetch(config.guildID);
	const member: GuildMember = await guild.members.fetch(user);

	if (member === guild.owner) return 5;

	const perms = member.permissions;
	if (perms.has('ADMINISTRATOR')) return 4;

	return getHierarchyLvl(member);
};
