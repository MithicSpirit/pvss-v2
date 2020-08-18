import { Client, Snowflake } from 'discord.js';
import mgr from './valueManager';
import { config } from './config';
const muteRole = config.muteRoleID;
const guildID = config.guildID;

interface Mute {
	id: Snowflake;
	time: number;
}

const tempMutes = async (now: number, client: Client): Promise<void> => {
	const guild = await client.guilds.fetch(guildID);
	const curr: Mute[] = mgr.tempMutes('r');
	const fixList = curr.filter((mute) => mute.time < now);

	for (const i of fixList) {
		try {
			mgr.tempMutes('w-', i);
			const member = await guild.members.fetch(i.id);
			member.roles.remove(muteRole);
		} catch (error) {
			console.error(error);
		}
	}
};

export default (client: Client): void => {
	const now = Date.now();
	tempMutes(now, client);
};
