import mgr from '../valueManager';
import { Client, Message, Snowflake } from 'discord.js';
import { config } from '../config';
const prefix = config.prefix;
const muteRole = config.muteRoleID;

const timeMults = new Map([
	['s', 1000],
	['m', 1000 * 60],
	['h', 1000 * 60 * 60],
	['d', 1000 * 60 * 60 * 24],
	['w', 1000 * 60 * 60 * 24 * 7],
]);
const timeUnits = [...timeMults.keys()];
const timeRegex = new RegExp(`(\\d+?)([${timeUnits.join('')}])`, 'gi');

const run = (args: string[], message: Message, client: Client): string => {
	const guild = client.guilds.resolve(config.guildID);

	if (args.length < 2)
		return `Invalid syntax. Please use \`${prefix}help tempmute\` for more information.`;

	let user: Snowflake;
	try {
		user = /<@!(\d+)>/.exec(args.shift())[1];
	} catch {
		return 'Invalid user.';
	}

	let time = Date.now();
	try {
		for (const t of args) {
			const res = new RegExp(timeRegex).exec(t);
			const unit = timeMults.get(res[2]);
			const val = Number(res[1]);
			time += val * unit;
		}
		if (isNaN(time)) throw 'Invalid time.';
	} catch {
		return `${args.join(
			' ',
		)} is not a valid time. Please use \`${prefix}help tempmute\` for more information.`;
	}

	const mutes = mgr.tempMutes('r');
	const ind = mutes.findIndex((mute) => mute.id === user);
	if (ind !== -1) {
		if (mutes[ind].time > time)
			return `User <@${user}> is already tempmuted for more time than ${args.join(
				' ',
			)}.`;
		else mgr.tempMutes('w-', mutes[ind]);
	}

	const member = guild.member(user);
	if (!member.manageable)
		return `There was an error with assigning the muted role to the user <@${user}>`;
	member.roles.add(muteRole);

	const muteObj = {
		id: user,
		time: time,
	};
	mgr.tempMutes('w+', muteObj);

	return `User <@${user}> has been muted for ${args.join(' ')}`;
};

const perms = 3;

const help = `\`${prefix}tempmute <@user> <mute_time> [...]\`
Mutes \`@user\` for \`mute_time\`. Supported units for \`mute_time\` are \`s\`, \`m\`, \`h\`, \`d\`, and \`w\`.`;

const desc = `\`${prefix}tempmute <@user> <mute_time> [...]\`: Temporarily mutes a user.`;

export default {
	run,
	help,
	perms,
	desc,
};
