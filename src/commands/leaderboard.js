const Discord = require('discord.js-light');
const Coins = require('../util/mongo/coins.js');
const Commands = require('../util/mongo/commands.js');
const Feed = require('../util/mongo/feed.js');
const Profile = require('../util/mongo/profile.js');
const util = require('../util/util.js');
const numbers = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':keycap_ten:'];

module.exports = {
    name: 'leaderboard',
    aliases: ['top'],
    example: ['sp!top coins', 'sp!top feed', 'sp!top xp', 'sp!top cmds'],
    description: 'Display the leaderboard of top ranked users. Categories: `coins` `cmds` `feed` `xp`',
    usage: 'sp!top <category>',
    cooldown: 7,
    async execute(bot, message, args) {

        if (!args.length) {
            return message.reply(`⛔ You need to provide a valid category!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});
        } else {
            const category = args[0].toLowerCase();
            if (category === 'coins') {
                coins();
            } else if (category === 'feed') {
                feed();
            } else if (category === 'xp') {
                xp();
            } else if (category === 'cmds') {
                cmds();
            } else {
                return message.reply(`⛔ You need to provide a valid category!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});
            }
        }

        async function coins() {
            const res = await Coins.find().sort({
                coins: -1
            }).limit(10);
            const tot = await Coins.aggregate([{
                $group: {
                    _id: null,
                    coins: {
                        $sum: {
                            $add: ['$coins']
                        }
                    }
                }
            }]).exec();
            const size = await Coins.find().estimatedDocumentCount();
            if (res === null) return message.reply('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Coins leaderboard')
                .setDescription(`This leaderboard shows the richest users 🤑.\n\nTotal coins: **${util.comma(tot[0].coins)}** ${bot.coin}`)
                .setColor('#00ff00')
                .setFooter(`Total users: ${size}`);

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].coins)}** ${bot.coin}`);
                }
            }
            message.reply(embed).catch(() => {});
        }

        async function feed() {
            const res = await Feed.find().sort({
                total: -1
            }).limit(10);
            const tot = await Feed.aggregate([{
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $add: ['$total']
                        }
                    }
                }
            }]).exec();
            const size = await Feed.find().estimatedDocumentCount();
            if (res === null) return message.reply('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Feed leaderboard')
                .setDescription(`This leaderboard shows users which fed <:TEwumpusCrown:710996351042846720> **Wumpus** the most.\n\n**Wumpus** was fed **${util.comma(tot[0].total)}** times in total.`)
                .setColor('#00ff00')
                .setFooter(`Total users: ${size}`);

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].total)}**`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].total)}**`);
                }
            }
            message.reply(embed).catch(() => {});
        }

        async function xp() {
            const res = await Profile.find().sort({
                totXp: -1
            }).limit(10);
            const tot = await Profile.aggregate([{
                $group: {
                    _id: null,
                    totXp: {
                        $sum: {
                            $add: ['$totXp']
                        }
                    }
                }
            }]).exec();
            const size = await Profile.find().estimatedDocumentCount();
            if (res === null) return message.reply('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('XP leaderboard')
                .setDescription(`This leaderboard shows users with the highest EXP 🆙 + level.\n\nTotal EXP: **${util.comma(tot[0].totXp)}** ${bot.xp}`)
                .setColor('#00ff00')
                .setFooter(`Total users: ${size}`);

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].totXp)}** ${bot.xp} ${bot.clear}Lvl: **${res[i].lvl}**`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].totXp)}** ${bot.xp} ${bot.clear}Lvl: **${res[i].lvl}**`);
                }
            }
            message.reply(embed).catch(() => {});
        }

        async function cmds() {
            const res = await Commands.find().sort({
                total: -1
            }).limit(10);
            const tot = await Commands.aggregate([{
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $add: ['$total']
                        }
                    }
                }
            }]).exec();
            const size = await Commands.find().estimatedDocumentCount();
            if (res === null) return message.reply('⛔ No data found. Please try again later!').catch(() => {});

            const embed = new Discord.MessageEmbed()
                .setTitle('Commands leaderboard')
                .setDescription(`This leaderboard shows users with most ran commands.\n\nTotal commands ran: **${util.comma(tot[0].total)}**`)
                .setColor('#00ff00')
                .setFooter(`Total users: ${size}`);

            for (let i = 0; i < res.length; i++) {
                const user = await util.getUser(bot, res[i].userID);
                if (!user) {
                    embed.addField(`${numbers[i]} ¯\\_(ツ)_/¯`, `${bot.clear} **${util.comma(res[i].total)}**`);
                } else {
                    embed.addField(`${numbers[i]} ${user.username}`, `${bot.clear} **${util.comma(res[i].total)}**`);
                }
            }
            message.reply(embed).catch(() => {});
        }


    },
};