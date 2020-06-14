import fs from 'fs';
import { Snowflake } from 'discord.js';

interface Mute {
	id: Snowflake;
	time: number;
}
interface Data {
	tempMutes: Mute[];
}

const data: Data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

const tempMutes = (type: 'r' | 'w+' | 'w-', value?: Mute): Mute[] => {
	try {
		if (type === 'w+') data.tempMutes.push(value);
		else if (type === 'w-') {
			const ind = data.tempMutes.indexOf(value);
			data.tempMutes.splice(ind, 1);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
	return data.tempMutes;
};

const backup = (): void =>
	fs.writeFileSync('./data.json', JSON.stringify(data), 'utf8');

export default { tempMutes, backup };
