import fs from 'fs';
import { Snowflake } from 'discord.js';

interface Mute {
	id: Snowflake;
	time: number;
}
interface Data {
	tempMutes: Mute[];
}

let importSuccess = false;
let data: Data;

fs.readFile('./data.json', 'utf8', (error, content) => {
	try {
		if (error) throw error;
		data = JSON.parse(content);
	} catch (e) {
		console.log(e);
		console.log('\nData was not imported correctly; please restart.');
		return;
	}
	console.log('Data successfully imported!');
	importSuccess = true;
	return;
});

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
	if (!importSuccess)
		console.log('\nData was not imported correctly; please restart.');
	else {
		fs.writeFile('./data.json', JSON.stringify(data), 'utf8', (error) => {
			if (error) console.log(error);
			else console.log('Backed up.');
		});
	}
};

export default { tempMutes, backup };
