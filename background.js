module.exports = {
	checkAll,
};

const checkAll = (client) => {
	const now = Date.now();
	return tempMutes(now, client);
};

const muteRole = '688514323194445827';
const tempMutes = (now, client) => {
	const curr = require('./data/temp-mutes.json');
	const fixList = [];
	for (const i in curr) {
		mute = curr[i];
		if (mute.time < now) {
			fixList.push(mute);
			curr.splice(i, 1);
		}
	}

	for (const i of fixList) {
		try {
			const guild = client.guilds.resolve(i.guildId);
			const member = guild.members.resolve(i.id);
			member.roles.remove(muteRole);
		} catch (error) {
			console.log(error);
		}
	}
};
