/*
Permission levels:
0 = @everyone
1 = STUDENTS
2 = Trusted Perms
3 = MOD
4 = MEGAMOD, admin
*/

import { GuildMember } from 'discord.js';
import { config } from './bot';
const hierarchy = config.roleHierarchy;

const getHierarchyLvl = (member: GuildMember): number => {
	const memberRoles = member.roles.cache;
	const permLvl = memberRoles.reduce(
		(total, current) => Math.max(total, hierarchy[current.id]),
		0,
	);
	return permLvl;
};

export default (member: GuildMember): number => {
	const perms = member.permissions;
	if (perms.has('ADMINISTRATOR')) {
		return 4;
	} else {
		return getHierarchyLvl(member);
	}
};
