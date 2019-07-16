require('dotenv').config()
const Discord = require('discord.js');
const Coins = require('../util/mongo/coins.js');
const cm = require('comma-number');

module.exports = {
    name: 'leaderboard',
    aliases: ['leader', 'leaders'],
    description: 'See top users with the leaderboard. Get an overview of the current data.',
    usage: '<group>',
    cooldown: 5,
    id: 16,
    async execute(bot, message, args) {

        if (args.length) {
            if (args[0].toLowerCase() === 'coins' || args[0].toLowerCase() === 'c') {
                Coins.find({
                    getIndex: 0
                }).sort([
                    ['coins', 'descending']
                ]).exec((err, res) => {
                    if (err) console.log(err);

                    let result = new Discord.RichEmbed()
                        .setTitle('Coins leaderboard');

                    if (res.length === 0) {
                        result.setColor('#ff0000')
                            .setDescription('No users found!')
                            .setTimestamp();
                    } else if (res.length < 10) {
                        result.setColor('#00ff00')
                            .setTimestamp();
                        for (let i = 0; i < res.length; i++) {
                            let member;
                            try {
                                member = bot.users.get(res[i].userID).username;
                            } catch (err) {
                                member = 'Unknown User';
                            }
                            if (member) {
                                result.addField(`${i + 1}. ${member}`, `**Coins:** ${cm(res[i].coins)} 💰`);
                            }
                        }
                    } else {
                        result.setColor('#00ff00')
                            .setTimestamp();
                        for (let i = 0; i < 10; i++) {
                            let member;
                            try {
                                member = bot.users.get(res[i].userID).username;
                            } catch (err) {
                                member = 'Unknown User';
                            }
                            if (member) {
                                result.addField(`${i + 1}. ${member}`, `**Coins:** ${cm(res[i].coins)} 💰`);
                            }
                        }
                    }

                    message.channel.send(result);

                })
            } else {
                message.channel.send('🚫 We are sorry, the coin leaderboard is the only one availabe for now. `-leaderboard coins`');
            }
        } else {
            message.channel.send('🚫 We are sorry, the coin leaderboard is the only one availabe for now. `-leaderboard coins`');
        }
    },
};