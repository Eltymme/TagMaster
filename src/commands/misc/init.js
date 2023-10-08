const { ApplicationCommandOptionType, EmbedBuilder  } = require('discord.js');

module.exports = {
    name: 'init',
    description: 'Use this command to setup the bot in the server.',
    devOnly: false,
    deleted: false,
    options: [{
        name: 'init-channel',
        description: 'Channel where the bot while send messages.',
        type: ApplicationCommandOptionType.Channel,
        required: true,
    }, {
        name: 'start-tag-user',
        description: 'The first user tagging.',
        type: ApplicationCommandOptionType.User,
        required: true,
    }],
    callback: (client, interaction) => {
        const fs = require("fs");
        const bot_profile_json = "./././botProfile.json";
        
        var botProfile = fs.readFileSync(bot_profile_json, "utf-8");
        var newbotProfile = [];

        newbotProfile = JSON.parse(botProfile);
        
        for (let i = 0; i < newbotProfile.guildsProfile.length; i++) {
            currentGuildProfile = newbotProfile.guildsProfile[i];

            if (!currentGuildProfile.guildId === interaction.guild_id) continue;

            newbotProfile.guildsProfile.splice(i, 1);
            break;
        }

        var channel = interaction.options.get('init-channel');
        var user = interaction.options.get('start-tag-user');

        newbotProfile.guildsProfile.push({
                'channelId': channel.value,
                'userTag': user.value,
                'tagDate': new Date().getTime(),
                'tagHistory': [],
            }
        );

        fs.writeFile(bot_profile_json, JSON.stringify(newbotProfile), (err, result) =>
        {
            if (err) console.log("error", err);
        });

        const embed = new EmbedBuilder ()
        .setTitle('✅ BOT SETUP HAS BEEN SUCCESSFULLY DONE ON THE SERVER!')
        .addFields({name: 'Message channel:', value: channel.channel.name}, {name: 'Start user:', value: user.user.globalName})
        .setColor(0xFFFFFF);

        interaction.reply({ embeds: [embed] });
    }
};