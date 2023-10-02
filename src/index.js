require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client(new Discord.Intents(32767));

client.once('ready', () => {
    console.log(`${client.user.tag} is ready!`);
});

client.login(process.env.TOKEN);