module.exports = {
    name: 'ping',
    aliases: ['latency'],
    description: 'Check my current ping.',
    cooldown: 1,
    async execute(bot, message) {

        message.reply(`🏓 Pong! \`${bot.ws.ping} ms\``).then(msg => {
            msg.edit(`🏓 Pong! WS: \`${bot.ws.ping} ms\` REST: \`${msg.createdTimestamp - message.createdTimestamp} ms\``).catch(() => {});
        }).catch(() => {});

    },
};