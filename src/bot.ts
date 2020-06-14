import { auth as botToken, config } from './config';
import * as Discord from 'discord.js';
import runCommands from './command';
import checkBackground from './background';
import mgr from './valueManager';

const client = new Discord.Client({ disableMentions: 'everyone' });

client.on('ready', () => {
	client.on('message', (message) => {
		const content = message.content;
		if (!content.startsWith(config.prefix)) return;

		const args = content.slice(config.prefix.length).split(/ +/);
		const cmd = args.shift();
		message.channel.send(runCommands(cmd, args, message, client));
	});

	client.setInterval(checkBackground, 5000, client);
	client.setInterval(mgr.backup, 8090);
	console.log('Ready!');
});

client.login(botToken).catch(console.error);
