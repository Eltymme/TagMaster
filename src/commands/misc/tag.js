const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'tag',
    description: 'Use this command when you successed to tag someone.',
    devOnly: false,
    deleted: false,
    options: [{
        name: 'user',
        description: 'The user you successed to tag.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    }],
    callback: (client, interaction) => {
        interaction.reply(`User to be tag is ${interaction.options.get('user').value}.`)
    }
}