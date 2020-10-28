const Channel = require('../util/mongo/channel.js');

module.exports = {
    name: 'disable',
    example: ['-disable all', '-disable slots daily', '-disable avatar #general'],
    description: 'Disable commands for a channel.',
    usage: '-disable (command/all) (#channel)',
    cooldown: 3,
    async execute(bot, message, args) {

        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('⛔ You require the permission `Manage Channels`!').catch(() => {});

        const {
            commands
        } = message.client;
        let allCmds = [];
        commands.forEach(c => {
            if (!['eval', 'enable', 'disable'].some(e => c.name === e)) {
                allCmds.push(c.name);
            }
        });

        let channel = message.channel;
        if (message.mentions.channels) {
            channel = message.mentions.channels.first();
        }

        if (!args.length) {
            listCommands(channel.id);
        } else {
            disableCommands(channel.id, args);
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
            message.channel.send(`✅ Updated commands for channel <#${ID}>.`).catch(() => {});
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
            message.channel.send(`🖇️ Commands for channel <#${ID}>: ${tmp.join(', ')}`).catch(() => {});
        }

    },
};