import * as Discord from 'discord.js';
import { token as botToken } from '../auth.json';
import './commands';
import runCommands from './command';
import { prefix } from '../config.json';
import checkBackground from './background';
import mgr from './valueManager';

const client = new Discord.Client({ disableMentions: 'everyone' });
client.login(botToken).catch(console.error);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	const content = message.content;
	if (!content.startsWith(prefix)) return;
	const args = content.slice(prefix.length).split(/ +/);
	const cmd = args.shift();
	message.channel.send(runCommands(cmd, args, message, client));
});

client.setInterval(checkBackground, 5000, client);
client.setInterval(mgr.backup, 8090);
