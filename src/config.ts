import fs from 'fs';
import { Snowflake } from 'discord.js';

interface Config {
	prefix: Snowflake;
	roleHierarchy: Record<Snowflake, number>;
	guildID: Snowflake;
	muteRoleID: Snowflake;
	roleCategories: { name: string; id: Snowflake }[];
}

let auth: { token: Snowflake };
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
export const authToken = auth.token;

export let config: Config;
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
