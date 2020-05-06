import data from './data.json';
import fs from 'fs';

interface Mute {
	id: string;
	time: number;
	guildId: string;
}

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

const backup = (): void => {
	fs.writeFile('./data.json', JSON.stringify(data), (error) => {
		if (error) console.log(error);
	});
};

export default { tempMutes, backup };
