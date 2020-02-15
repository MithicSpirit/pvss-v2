module.exports = {
	'run': run(),
	'commands': commands,
};

const getPerms = require('./checkPerms.js').getPermLvl;
const fs = require('fs');

const commands = fs.readdir('./commands/', (error, files) => {
	if (error) console.log(error);

	const cmdList = new Map();
	files = files.filter(file => file.endsWith('.js'));
	for (const file in files) {
		const command = require('./commands/' + file);
		cmdList.set(file, command);
	}

	return cmdList;
});


const run = (cmd, args, message, client) => {
	const command = commands.get(cmd);
	if (command === undefined) return;

	if (command.perms > getPerms(message.member)) {
		message.reply('Insufficient permissions!');
		return;
	} else return command.run(args, {'message': message, 'client': client});
};