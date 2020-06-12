import { Client, Snowflake } from 'discord.js';
import mgr from './valueManager';
import { config } from './bot';
const muteRole = config.muteRoleID;
const guildID = config.guildID;

interface Mute {
	id: Snowflake;
	time: number;
}

const tempMutes = (now: number, client: Client): void => {
	const guild = client.guilds.resolve(guildID);
	const curr: Mute[] = mgr.tempMutes('r');
	const fixList = curr.filter((mute) => mute.time < now);

	for (const i of fixList) {
		try {
			mgr.tempMutes('w-', i);
			const member = guild.members.resolve(i.id);
			member.roles.remove(muteRole);
		} catch (error) {
			console.log(error);
		}
	}
};

export default (client: Client): void => {
	const now = Date.now();
	tempMutes(now, client);
};
