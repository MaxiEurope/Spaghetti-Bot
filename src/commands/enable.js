const Channel = require('../util/mongo/channel.js');

module.exports = {
    name: 'enable',
    example: ['sp!enable all', 'sp!enable slots daily', 'sp!enable avatar #general'],
    description: 'Enable commands for a channel.',
    usage: 'sp!enable (command/all) (#channel)',
    cooldown: 3,
    async execute(bot, message, args) {

        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('⛔ You require the `Administrator` permission!').catch(() => {});

        const {
            commands
        } = message.client;
        let allCmds = [];
        await commands.forEach(c => {
            if (!['eval', 'enable', 'disable'].some(e => c.name === e)) {
                allCmds.push(c.name);
            }
        });

        let channel = message.channel.id;
        if (message.mentions.channels.size > 0) {
            channel = message.mentions.channels.first().id;
            args.pop();
        }

        if (!args.length || args.length === 0) {
            listCommands(channel);
        } else {
            enableCommands(channel, args);
        }

        async function enableCommands(ID, args) {
            let tmp = [];
            if (args[0].toLowerCase() === 'all') {
                tmp = [];
            } else {
                let enable = new Set();
                for (let i = 0; i < args.length; i++) {
                    if (allCmds.includes(args[i])) {
                        enable.add(args[i]);
                    }
                }
                tmp = Array.from(enable);
            }
            const res = await Channel.findOne({
                channelID: ID
            });
            if (res === null) {
                await new Channel({
                    channelID: ID,
                    disabled: []
                }).save().catch(() => {});
            } else {
                let arrayDone = res.disabled.filter(e => !tmp.includes(e));
                if (args[0].toLowerCase() === 'all') {
                    arrayDone = tmp;
                }
                await Channel.findOneAndUpdate({
                    channelID: ID
                }, {
                    disabled: arrayDone
                });
            }
            message.reply(`✅ Updated commands for channel <#${ID}>.`).catch(() => {});
        }

        async function listCommands(ID) {
            let tmp = [];
            const res = await Channel.findOne({
                channelID: ID
            });
            if (res === null) {
                allCmds.forEach(c => {
                    tmp.push(c);
                });
            } else {
                allCmds.forEach(c => {
                    tmp.push((res.disabled.includes(c) ? `~~${c}~~` : c));
                });
            }
            message.reply(`🖇️ Commands for channel <#${ID}>:\n${bot.clear} ${tmp.join(', ')}`).catch(() => {});
        }

    },
};