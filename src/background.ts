import { Client, Snowflake } from 'discord.js';
import mgr from './valueManager';

interface Mute {
	id: Snowflake;
	time: number;
	guildId: Snowflake;
}

const muteRole = '688514323194445827';
const tempMutes = (now: number, client: Client): void => {
	const curr: Mute[] = mgr.tempMutes('r');
	const fixList = curr.filter((mute) => mute.time < now);

	for (const i of fixList) {
		try {
			mgr.tempMutes('w-', i);
			const guild = client.guilds.resolve(i.guildId);
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
