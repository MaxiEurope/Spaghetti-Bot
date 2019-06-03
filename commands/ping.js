module.exports = {
    name: 'ping',
    description: 'Check if I\'m alive and my current ping.',
    async execute(bot, message, args) {

        message.channel.send(`🏓 **|** Pong! My ping: **${Math.round(bot.ping)}ms**\n` +
            `↩ **|** Previous pings: **${Math.round(bot.pings.join(', '))}ms**`);

    },
};