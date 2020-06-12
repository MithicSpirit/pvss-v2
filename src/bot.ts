import * as Discord from 'discord.js';
import './commands';
import runCommands from './command';
import checkBackground from './background';
import mgr from './valueManager';
import fs from 'fs';

interface Config {
	prefix: Discord.Snowflake;
	roleHierarchy: Record<Discord.Snowflake, number>;
	guildID: Discord.Snowflake;
	muteRoleID: Discord.Snowflake;
}

let auth: { token: Discord.Snowflake };
fs.readFile('./auth.json', 'utf8', (error, content) => {
	try {
		if (error) throw error;
		auth = JSON.parse(content);
	} catch (e) {
		console.log(e);
		console.log(
			'\nThe authentication token was not imported correctly; please restart.',
		);
		return;
	}
	console.log('Authentication token successfully imported!');
	return;
});
const botToken: Discord.Snowflake = auth.token;

let config: Config;
fs.readFile('./auth.json', 'utf8', (error, content) => {
	try {
		if (error) throw error;
		config = JSON.parse(content);
	} catch (e) {
		console.log(e);
		console.log('\nThe config was not imported correctly; please restart.');
		return;
	}
	console.log('Config successfully imported!');
	return;
});
const prefix = config.prefix;

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
	message.channel.send(runCommands(cmd, args, message));
});

client.setInterval(checkBackground, 5000, client);
client.setInterval(mgr.backup, 8090);

export { config, client };
