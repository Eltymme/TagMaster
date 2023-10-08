const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'set-tag',
    description: 'Use this command when you want to force a tag.',
    devOnly: true,
    deleted: false,
    options: [{
        name: 'user',
        description: 'The user to set tag.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    }],
    callback: (client, interaction) => {
        interaction.reply(`New user tagged is ${interaction.options.get('user').value}.`)
    }
}