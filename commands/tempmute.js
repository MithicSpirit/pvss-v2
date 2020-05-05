const fs = require('fs');
const prefix = require('../config.json').prefix;

module.exports = {
	run: run(),
	help: help,
	perms: perms,
	desc: desc,
};

const timeMults = new Map([
	['s', 1000],
	['m', 1000 * 60],
	['h', 1000 * 60 * 60],
	['d', 1000 * 60 * 60 * 24],
	['w', 1000 * 60 * 60 * 24 * 7],
]);
const timeRegex = new RegExp(`\\d*?[${timeMults.keys.join('')}]`, 'gyi');

const run = (args, info) => {
	if (args.length < 2) {
		const invalidSyntax = `Invalid syntax. Please use \`${prefix}help tempmute\` for more information.`;
		info.message.channel.send(invalidSyntax);
		return invalidSyntax;
	}

	const user = args.shift();
	const timeStr = args.join('');

	let time = Date.now();
	for (const i in timeRegex.exec(timeStr)) {
		const mult = i.slice(-1);
		const tBase = Number(i.slice(0, -1));
		time += tBase * timeMults.get(mult);
	}
	if (isNaN(time)) {
		const invalidTime = `${args.join(' ')} is not a valid time.`;
		info.message.channel.send(invalidTime);
		return invalidTime;
	}

	const muteObj = {
		id: user,
		time: time,
	};

	const mutes = require('../data/temp-mutes.json');
	mutes.push(muteObj);
	fs.writeFile('../data/temp-mutes.json', JSON.stringify(mutes));

	const successMsg = `User <${user}> has been muted for ${timeStr}`;
	info.message.channel.send(successMsg);
	return successMsg;
};

const perms = 3;

const help = `\`${prefix}tempmute <@user> <mute_time>\`
Mutes \`@user\` for \`mute_time\`. Supported units for \`mute_time\` are \`s\`, \`m\`, \`h\`, \`d\`, and \`w\`.`;

const desc = `\`${prefix}help <@user> <mute_time>\`: Temporarily mutes a user.`;
