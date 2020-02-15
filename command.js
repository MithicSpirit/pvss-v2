module.exports = run();

const getPerms = require('./checkPerms.js');
const fs = require('fs');

const commands = new Map();
fs.readdir('./commands/', (error, files) => {
	if (error) console.log(error);
	else {
		for (const file in files) {
			const command = require('./commands/' + file);
			commands.set(file, command);
		}
	}
	return;
});


const run = (cmd, args, message) => {
	const command = commands.get(cmd);
	if (command === undefined) {
		message.reply('Insufficient permissions!');
		return;
	}
	if (command === getPerms(message.author)) {
		command.run(args, message);
	}
};