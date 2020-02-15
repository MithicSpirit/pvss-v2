const Discord = require('discord.js');
const auth = require('./auth.json');
const runCommands = require('./commands.js');
const config = require('./config.json');

const client = new Discord.Client();
client.login(auth.token).catch(console.error);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	const content = message.content;
	if (!content.startsWith(config.prefix)) return;
	const args = content.slice(config.prefix.length).split(/ +/);
	const cmd = args.shift();
	runCommands(cmd, args, message);
});