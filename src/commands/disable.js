const Channel = require('../util/mongo/channel.js');

module.exports = {
    name: 'disable',
    example: ['sp!disable all', 'sp!disable slots daily', 'sp!disable avatar #general'],
    description: 'Disable commands for a channel.',
    usage: 'sp!disable (command/all) (#channel)',
    cooldown: 3,
    async execute(bot, message, args) {

        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('⛔ You require the permission `Manage Channels`!').catch(() => {});

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
            disableCommands(channel, args);
        }

        async function disableCommands(ID, args) {
            let tmp = [];
            if (args[0].toLowerCase() === 'all') {
                tmp = allCmds;
            } else {
                let disable = new Set();
                for (let i = 0; i < args.length; i++) {
                    if (allCmds.includes(args[i])) {
                        disable.add(args[i]);
                    }
                }
                tmp = Array.from(disable);
            }
            const res = await Channel.findOne({
                channelID: ID
            });
            if (res === null) {
                await new Channel({
                    channelID: ID,
                    disabled: tmp
                }).save().catch(() => {});
            } else {
                const arrayDone = res.disabled.concat(tmp);
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