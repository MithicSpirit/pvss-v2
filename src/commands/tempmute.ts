import mgr from '../valueManager';
import { Message } from 'discord.js';
import client from '../bot';
import { config } from '../config';
const prefix = config.prefix;
const muteRole = config.muteRoleID;
const guild = client.guilds.resolve(config.guildID);

const timeMults = new Map([
	['s', 1000],
	['m', 1000 * 60],
	['h', 1000 * 60 * 60],
	['d', 1000 * 60 * 60 * 24],
	['w', 1000 * 60 * 60 * 24 * 7],
]);
const timeUnits = [...timeMults.keys()];
const timeRegex = new RegExp(`\\d*?[${timeUnits.join('')}]`, 'gyi');

const run = (args: string[], message: Message): string => {
	if (args.length < 2)
		return `Invalid syntax. Please use \`${prefix}help tempmute\` for more information.`;

	const user = args.shift();
	const timeStr = args.join('');

	let time = Date.now();
	for (const i of timeRegex.exec(timeStr)) {
		const mult = i.slice(-1);
		const tBase = Number(i.slice(0, -1));
		time += tBase * timeMults.get(mult);
	}
	if (isNaN(time)) return `${args.join(' ')} is not a valid time.`;

	const mutes = mgr.tempMutes('r');
	const ind = mutes.findIndex((mute) => mute.id === user);
	if (ind !== -1) {
		if (mutes[ind].time > time)
			return `User <${user}> is already tempmuted for more time than ${timeStr}.`;
		else mgr.tempMutes('w-', mutes[ind]);
	}

	try {
		const member = guild.member(user);
		member.roles.add(muteRole);
	} catch (error) {
		return `There was an error with assigning the muted role to the user <${user}>`;
	}

	const muteObj = {
		id: user,
		time: time,
	};
	mgr.tempMutes('w+', muteObj);

	return `User <${user}> has been muted for ${timeStr}`;
};

const perms = 3;

const help = `\`${prefix}tempmute <@user> <mute_time>\`
Mutes \`@user\` for \`mute_time\`. Supported units for \`mute_time\` are \`s\`, \`m\`, \`h\`, \`d\`, and \`w\`.`;

const desc = `\`${prefix}tempmute <@user> <mute_time>\`: Temporarily mutes a user.`;

export default {
	run,
	help,
	perms,
	desc,
};
