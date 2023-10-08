const { timeStamp } = require('console');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'tag',
    description: 'Use this command when you successed to tag someone.',
    devOnly: false,
    deleted: false,
    options: [{
        name: 'user',
        description: 'The user you successed to tag.',
        type: ApplicationCommandOptionType.User,
        required: true,
    }, {
        name: 'description',
        description: 'The way you successed to tag the person',
        type: ApplicationCommandOptionType.String,
    }],
    callback: async (client, interaction) => {
        const fs = require("fs");
        const bot_profile_json = "./././botProfile.json";
        const botProfile = fs.readFileSync(bot_profile_json, "utf-8");

        var newbotProfile = [];
        var guildProfile;

        newbotProfile = JSON.parse(botProfile);
        
        for (let i = 0; i < newbotProfile.guildsProfile.length; i++) {
            currentGuildProfile = newbotProfile.guildsProfile[i];

            if (!currentGuildProfile.guildId === interaction.guild_id) continue;

            guildProfile = currentGuildProfile;
            newbotProfile.guildsProfile.splice(i, 1);
            break;
        }

        if (guildProfile === undefined) {
            interaction.reply({
                content: 'You need to setup the server before starting tag someone.',
                ephemeral: true,
            });
        
            return;
        }
        
        const targetUser = interaction.options.get('user');
        const tagTimeSpend = Math.round((new Date().getTime() -  new Date(parseInt(guildProfile.tagDate)).getTime()) / 1000);
        const tagTimeSpendTimeStamp = {
            secondes: tagTimeSpend%60,
            minutes: Math.floor(tagTimeSpend/60)%60,
            hours: Math.floor(tagTimeSpend/3600)
        };

        if (interaction.user.id !== guildProfile.userTag) {
            interaction.reply({
                content: 'You are not the current person tagged...',
                ephemeral: true,
            });
            return;
        } else if (interaction.user.id === targetUser.user.id) {
            interaction.reply({
                content: 'You cannot tag yourself...',
                ephemeral: true,
            });
            return;
        } else if (targetUser.user.bot) {
            interaction.reply({
                content: 'You cannot tag a bot...',
                ephemeral: true,
            });
            return;
        } else if (tagTimeSpend < 7200) {
            interaction.reply({
                content: "It's been less than 2 hours, you cannot tag someone...",
                ephemeral: true,
            });
            return;
        } 
            
        interaction.reply({
            content: `${targetUser.user.username} as been successfully added as the new tagger!`,
            ephemeral: true,
        });
            
        const newTagHistory = guildProfile.tagHistory;
        guildProfile.tagHistory.push({userId: guildProfile.userTag, spendTime: tagTimeSpend})

        newbotProfile.guildsProfile.push({
            'channelId': guildProfile.channelId,
            'userTag': targetUser.user.id,
            'tagDate': new Date().getTime().toString(),
            'tagHistory': newTagHistory,
        });

        //fs.writeFile(bot_profile_json, JSON.stringify(newbotProfile), (err, result) =>
        //{
        //    if (err) console.log("error", err);
        //})

        const channel = await client.channels.cache.get(guildProfile.channelId);
        const previousUser = await client.users.cache.get(guildProfile.userTag);
        const description = interaction.options.get('description');
        const gifs = [
            "https://media.tenor.com/u2uD9WCRTi0AAAAC/on-my-way-cat-run.gif",
            "https://media.tenor.com/Tr4svi_j4zEAAAAC/skeleton-dancing.gif",
            "https://media.tenor.com/W_0ux9exhhwAAAAC/machikado-mazoku-running-away.gif",
            "https://media.tenor.com/PfKcoMTSyj0AAAAC/anime-golds-anime.gif",
            "https://media.tenor.com/DOooMboXwP0AAAAC/run-away.gif",
            "https://media.tenor.com/kzFPb4jwFhoAAAAd/demon-slayer-entertainment-district.gif",
            "https://media.tenor.com/vtqQAHBFP1IAAAAC/peach-goma.gif",
            "https://media.tenor.com/-H21lA4YeEcAAAAC/chase-moment.gif",
            "https://media.tenor.com/Cs4vh9JGdNYAAAAC/scooby-doo.gif",
            "https://media.tenor.com/goC3LqsCnrkAAAAC/matt-hug-hugs.gif",
            "https://media.tenor.com/PLKLy4G40ZsAAAAd/killer-cat-cat-knife.gif",
            "https://media.tenor.com/QMuue1MhQnoAAAAC/cat-aga.gif",
            "https://media.tenor.com/PTZFFyjL6B8AAAAC/our-flag-means-death-ofmd.gif",
            "https://media.tenor.com/cS4m59FxH2wAAAAC/tag.gif"
        ]

        const embed = new EmbedBuilder ()
        .setTitle(`👀 ${(targetUser.user.globalName === null ? targetUser.user.username : targetUser.user.globalName).toUpperCase()} HAVE BEEN TAG!`)
        .setImage(`${gifs[Math.floor(Math.random() * gifs.length)]}`)
        .addFields(
            {name: 'Previous tagger:', value: (previousUser.globalName === null ? previousUser.username : previousUser.globalName)},
            {name: 'Time Spend Tagger:', value: `${tagTimeSpendTimeStamp.hours}h : ${tagTimeSpendTimeStamp.minutes}min : ${tagTimeSpendTimeStamp.secondes}sec`})
        .setColor(0xFFFFFF);

        if (description !== null) {
            embed.addFields({name: 'Description:', value: description.value});
        }

        channel.send({ embeds: [embed] });
        channel.send(`<@${targetUser.user.id}> you have been tag, it's now you turn to tag someone else !`);
    }
}