const commands = require('../command.js').commands;
const prefix = require('../config.json').prefix;
const getPerms = require('../checkPerms.js').getPermLvl;

module.exports = {
	run: run(),
	help: help,
	perms: perms,
	desc: desc,
};

const run = (args, info) => {
	const user = info.message.member;
	const chan = info.message.channel;
	if (!args.length) {
		const cmds = [];
		const perms = getPerms(user);
		for (const command of commands)
			if (command[1].perms <= perms) cmds.append(command[1].desc);

		let helpMessage = '';
		cmds.forEach((cmd) => {
			helpMessage += cmd + '\n';
		});
		chan.send(helpMessage.trim);
		return helpMessage;
	} else if (args.length === 1) {
		const cmd = args[0];
		if (commands.has(cmd)) {
			const description = commands.get(cmd).desc;
			chan.send(description);
			return description;
		} else {
			const errorMsg = `Command ${cmd} not found`;
			chan.send(errorMsg);
			return errorMsg;
		}
	} else {
		const invalidSyntax = `Invalid syntax. Please use \`${prefix}help help\` for more information.`;
		chan.send(invalidSyntax);
		return invalidSyntax;
	}
};

const perms = 1;

const help = `\`${prefix}help\`
Prints out a list of all commands you have the necessary permissions to utilize and a basic description of each.

\`${prefix}help <command_name>\`
Provides more in-depth information on the command \`<command_name>\`.`;

const desc = `\`${prefix}help [command_name]\`: Provides information about commands.`;
