import help from './help';
import tempmute from './tempmute';
import stop from './stop';

// Make sure to sort the items in the map by perms first (low to high), then alphabetically

export default new Map([
	['help', help],
	['tempmute', tempmute],
	['stop', stop],
]);
