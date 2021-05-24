const Prefix = require('../util/mongo/prefix.js');
const util = require('../util/util.js');

module.exports = {
    name: 'prefix',
    example: ['sp!prefix sp!'],
    description: 'Set an additional prefix for your server. You can remove your prefix by using `sp!prefix sp!`, which will basically set it to the default one.',
    usage: 'sp!prefix (newprefix)',
    cooldown: 5,
    async execute(bot, message, args) {

        if (!args.length) {
            const res = await Prefix.findOne({
                serverID: message.guild.id
            });
            if (res) {
                message.reply(`🖇️ This servers prefix is set to \`${res.prefix}\``).catch(() => {});
            } else {
                message.reply('🖇️ The default prefix `sp!`. You can also mention me. You can set a prefix using `sp!prefix +` for example.').catch(() => {});
            }
        } else {
            if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('⛔ You require the `Administrator` permission!').catch(() => {});
            const prefix = args[0];
            if (prefix === 'sp!') {
                await Prefix.findOneAndDelete({
                    serverID: message.guild.id
                }).catch(() => {});
                bot.guildPrefixes.delete(message.guild.id);
                message.reply('✅ Set the server prefix to `sp!` (removed it).').catch(() => {});
            } else {
                if (util.count(prefix) > 10) return message.reply('⛔ That\'s a bit too long! (`10` characters max)').catch(() => {});
                const res = await Prefix.findOne({
                    serverID: message.guild.id
                });
                if (!res) {
                    await new Prefix({
                        serverID: message.guild.id,
                        prefix: prefix
                    }).save().catch(() => {});
                } else {
                    await Prefix.findOneAndUpdate({
                        serverID: message.guild.id
                    }, {
                        prefix: prefix
                    }).catch(() => {});
                }
                bot.guildPrefixes.set(message.guild.id, prefix);
                message.reply(`✅ Set the server prefix to \`${prefix}\`.`).catch(() => {});
            }
        }

    },
};