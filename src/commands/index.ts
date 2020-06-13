import help from './help';
import tempmute from './tempmute';
import stop from './stop';
import backup from './backup';

// Make sure to sort the items in the map by perms first (low to high), then alphabetically

export default new Map([
	['help', help],
	['tempmute', tempmute],
	['backup', backup],
	['stop', stop],
]);
