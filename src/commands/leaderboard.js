const Discord = require('discord.js');
const Coins = require('../util/mongo/coins.js');
const util = require('../util/util.js');

module.exports = {
    name: 'leaderboard',
    aliases: ['top'],
    description: 'Leaderboard full of top ranked user.',
    cooldown: 20,
    async execute(bot, message) {

        const res = await Coins.find().sort({
            coins: -1
        }).limit(10);
        if (res === null) return message.channel.send('⛔ No data found. Please try again later!').catch(() => {});

        const embed = new Discord.MessageEmbed()
            .setTitle('Coins leaderboard')
            .setColor('#00ff00');

        for (let i = 0; i < res.length; i++) {
            const user = await util.getUser(bot, res[i].userID);
            if (!user) {
                embed.addField(`[${i+1}] ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
            } else {
                embed.addField(`[${i+1}] ${user.username}`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
            }
        }
        message.channel.send(embed).catch(() => {});

    },
};