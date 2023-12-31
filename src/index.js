require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: IntentsBitField.Flags.Guilds,
})

eventHandler(client);

client.login(process.env.TOKEN);