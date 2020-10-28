const Prefix = require('../util/mongo/prefix.js');
const util = require('../util/util.js');

module.exports = {
    name: 'prefix',
    example: ['-prefix sp!'],
    description: 'Set an additional prefix for your server. You can remove your prefix by using `-prefix -`, which will basically set it to the default one.',
    cooldown: 5,
    async execute(bot, message, args) {

        if (!args.length) {
            const res = await Prefix.findOne({
                serverID: message.guild.id
            });
            if (res) {
                message.channel.send(`🖇️ This servers prefix is set to \`${res.prefix}\``).catch(() => {});
            } else {
                message.channel.send('🖇️ The default prefix `-`. You can set one using `-prefix sp!` for example.').catch(() => {});
            }
        } else {
            if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('⛔ You require the permission `Manage Channels`!').catch(() => {});
            const prefix = args[0];
            if (prefix === '-') {
                await Prefix.findByIdAndDelete({
                    serverID: message.guild.id
                });
                message.channel.send('✅ Set the server prefix to `-` (removed it).').catch(() => {});
            } else {
                if (util.count(prefix) > 10) return message.channel.send('⛔ That\'s a bit too long! (`10` characters max)').catch(() => {});
                await new Prefix({
                    serverID: message.guild.id,
                    prefix: prefix
                }).save().catch(() => {});
                message.channel.send(`✅ Set the server prefix to \`${prefix}\`.`).catch(() => {});
            }
        }

    },
};