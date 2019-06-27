require('dotenv').config()
const Guild = require('../util/mongo/guild.js');
const config = require('../config/config.json');
const lettercount = require('letter-count');

module.exports = {
    name: 'prefix',
    description: 'Set a prefix for your server. List your prefix by using `-prefix` and remove it by using `-prefix remove`',
    cooldown: 5,
    id: 11,
    async execute(bot, message, args) {

        Guild.findOne({
            serverID: message.guild.id
        }, (err, guild) => {
            if (err) console.log(err);
            if (args.length && args[0].toLowerCase() === 'set') {
                if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You need the `MANAGE_MESSAGES` permission.');
                let count = lettercount.count(args[1]).chars;
                if (count > 10) return message.channel.send('🚫 This prefix is definitely **too** long. Maximum char lenght: **10**');
                if (!guild) {
                    let nguild = new Guild({
                        serverID: message.guild.id,
                        prefix: args[1],
                        active: true
                    })
                    nguild.save().catch(err => console.log(err));
                    message.channel.send('🖇 Server prefix set: `' + args[1] + '`');
                } else {
                    guild.prefix = args[1];
                    guild.active = true;
                    guild.save().catch(err => console.log(err));
                    message.channel.send('🖇 Server prefix set: `' + args[1] + '`');
                }
            } else if (args.length && args[0] === 'remove') {
                if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You need the `MANAGE_MESSAGES` permission.');
                if (!guild || guild.active === false) {
                    message.channel.send('🖇 This server has no extra prefix set, therefore you can set one with `' + config.prefix + 'prefix set <prefix>`.');
                } else {
                    guild.active = false;
                    guild.save().catch(err => console.log(err));
                    message.channel.send('🖇 Removed server prefix. You can still use `' + config.prefix + '`.');
                }
            } else {
                if (!guild || guild.active === false) {
                    message.channel.send('🖇 This server has no extra prefix set, therefore you can set one with `' + config.prefix + 'prefix set <prefix>`.');
                } else {
                    message.channel.send('🖇 This servers prefix is `' + guild.prefix + '`.');
                }
            }
        })

    },
};