module.exports = {
    name: 'ping',
    description: 'Check if I\'m alive and my current ping.',
    cooldown: 1,
    id: 10,
    async execute(bot, message, args) {

        message.channel.send(`🏓 **Pong!** My ping: **${Math.round(bot.ping)}ms**\n` +
            `↩ **|** Previous pings: **${bot.pings}ms**`);

    },
};