require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: IntentsBitField.Flags.Guilds,
})

eventHandler(client);

console.log(process.env.TOKEN);

client.login(process.env.TOKEN);