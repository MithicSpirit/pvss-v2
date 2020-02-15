const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();
client.login(auth.token);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(`"${message.content}" by ${message.author.tag}`);
});