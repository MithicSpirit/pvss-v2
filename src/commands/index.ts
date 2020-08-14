import help from './help';
import tempmute from './tempmute';
import stop from './stop';
import backup from './backup';
import lsroles from './lsroles';
import { Message, Client } from 'discord.js';

interface Command {
	run: (args: string[], message: Message, client: Client) => string;
	help: string;
	desc: string;
	perms: number;
}
// Make sure to sort the items in the map by perms first (low to high), then alphabetically

const command: Map<string, Command> = new Map([
	['help', help],
	['tempmute', tempmute],
	['backup', backup],
	['stop', stop],
	['lsroles', lsroles],
]);

export default command;
