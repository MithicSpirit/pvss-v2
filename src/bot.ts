import { auth as botToken, config } from './config';
import * as Discord from 'discord.js';
import runCommands from './command';
import checkBackground from './background';
import mgr from './valueManager';

const client = new Discord.Client({ disableMentions: 'everyone' });

client.on('ready', () => {
	client.on('message', async (message) => {
		const content = message.content;
		if (!content.startsWith(config.prefix)) return;

		const args = content.slice(config.prefix.length).split(/ +/);
		const cmd = args.shift();
		try {
			const reply = await runCommands(cmd, args, message, client);
			message.channel.send(reply);
		} catch (error) {
			console.error(error);
			message.channel.send(
				'Internal error. Check logs for more information.',
			);
		}
	});

	client.setInterval(checkBackground, 5000, client);
	client.setInterval(mgr.backup, 5101);
	console.log('Ready!');
});

try {
	client.login(botToken);
} catch (error) {
	console.error(error);
	client.destroy();
	process.exit(1);
}
