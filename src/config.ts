import fs from 'fs';
import { Snowflake } from 'discord.js';

interface Config {
	prefix: Snowflake;
	roleHierarchy: Record<Snowflake, number>;
	guildID: Snowflake;
	muteRoleID: Snowflake;
	roleCategories: { name: string; id: Snowflake }[];
}

export const auth: Snowflake = fs.readFileSync('./auth', 'utf8').trim();

export const config: Config = JSON.parse(
	fs.readFileSync('./config.json', 'utf8'),
);
