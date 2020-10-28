const Discord = require('discord.js-light');
const Coins = require('../util/mongo/coins.js');
const Feed = require('../util/mongo/feed.js');
const Profile = require('../util/mongo/profile.js');
const util = require('../util/util.js');
const numbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:'];

module.exports = {
    name: 'leaderboard',
    aliases: ['top'],
    example: ['-top coins', '-top feed', '-top xp'],
    description: 'Display the leaderboard of top ranked users. Categories: `coins`, `feed`, `xp`',
    usage: '-top <category>',
    cooldown: 10,
    async execute(bot, message, args) {

        if (!args.length) {
            return message.channel.send(`⛔ You need to provide a valid category!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});
        } else {
            const category = args[0].toLowerCase();
            if (category === 'coins') {
                coins();
            } else if (category === 'feed') {
                feed();
            } else if (category === 'xp') {
                xp();
            } else {
                return message.channel.send(`⛔ You need to provide a valid category!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});
            }
        }

        async function coins() {
            const res = await Coins.find().sort({
                coins: -1
            }).limit(10);
            if (res === null) return message.channel.send('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Coins leaderboard')
                .setDescription('This leaderboard shows the richest users 🤑.')
                .setColor('#00ff00');

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
                }
            }
            message.channel.send(embed).catch(() => {});
        }

        async function feed() {
            const res = await Feed.find().sort({
                total: -1
            }).limit(10);
            if (res === null) return message.channel.send('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Feed leaderboard')
                .setDescription('This leaderboard shows users which fed **Discord Wumpus** the most.')
                .setColor('#00ff00');

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].total)}** 😋`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].total)}** 😋`);
                }
            }
            message.channel.send(embed).catch(() => {});
        }

        async function xp() {
            const res = await Profile.find().sort({
                totXp: -1
            }).limit(10);
            if (res === null) return message.channel.send('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Feed leaderboard')
                .setDescription('This leaderboard shows users with the highest EXP 🆙.')
                .setColor('#00ff00');

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].totXp)}** ${bot.xp}`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].totXp)}** ${bot.xp}`);
                }
            }
            message.channel.send(embed).catch(() => {});
        }


    },
};