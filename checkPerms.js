/*
Permission levels:
0 = @everyone
1 = STUDENTS
2 = Trusted Perms
3 = MOD
4 = MEGAMOD, admin
*/

module.exports = {
	getPermLvl: getPermLvl(),
};

const hierarchy = require('./roleHierarchy.json');

const getHierarchyLvl = (member) => {
	const memberRoles = member.roles;
	let permLvl = 0;
	for (const role in memberRoles) {
		if (role.id in hierarchy) {
			permLvl = Math.max(permLvl, hierarchy[role.id]);
		}
	}
	return permLvl;
};

const getPermLvl = (member) => {
	const perms = member.permissions;
	if (perms.has('ADMINISTRATOR')) {
		return 4;
	} else {
		return getHierarchyLvl(member);
	}
};
