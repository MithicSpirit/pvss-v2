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

const run = async (
	args: string[],
	message: Message,
	client: Client,
): Promise<string> => {
	let errorPoint = 0;
	let errorDesc = '';
	try {
		const guild = await client.guilds.fetch(config.guildID);

		if (args.length < 2) {
			errorPoint = 1;
			throw 'Invalid syntax.';
		}

		const userArg = args.shift();

		errorPoint = 2;
		errorDesc = userArg;
		const user: Snowflake = /<@!?(\d+)>/.exec(userArg)[1];
		errorPoint = 0;

		let time = Date.now();

		errorPoint = 3;
		errorDesc = args.join(' ');
		for (const t of args) {
			const res = new RegExp(timeRegex).exec(t);
			const unit = timeMults.get(res[2]);
			const val = Number(res[1]);
			time += val * unit;
		}
		if (isNaN(time)) throw 'Invalid time.';
		errorPoint = 0;

		const mutes = mgr.tempMutes('r');
		const ind = mutes.findIndex((mute) => mute.id === user);
		if (ind !== -1) {
			if (mutes[ind].time > time)
				return `User <@${user}> is already tempmuted for more time than ${args.join(
					' ',
				)}.`;
			else mgr.tempMutes('w-', mutes[ind]);
		}

		const member = await guild.members.fetch(user);

		errorPoint = 4;
		errorDesc = user;
		if (!member.manageable) throw 'Role nonassignable.';
		member.roles.add(muteRole);

		const muteObj = {
			id: user,
			time: time,
		};
		mgr.tempMutes('w+', muteObj);

		return `User <@${user}> has been muted for ${args.join(' ')}`;
	} catch (error) {
		switch (errorPoint) {
			default:
				throw error;
			case 1:
				return `Invalid syntax. Please use \`${prefix}help tempmute\` for more information.`;
			case 2:
				return `\`${errorDesc}\` is not a valid user.`;
			case 3:
				return `${errorDesc} is not a valid time. Please use \`${prefix}help tempmute\` for more information.`;
			case 4:
				return `There was an error with assigning the muted role to the user <@${errorDesc}>`;
		}
	}
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
