const Discord = require('discord.js-light');

module.exports = {
    name: 'vote',
    description: 'Vote for me on `top.gg` and `botsfordiscord.com` to get some sweet coins.',
    cooldown: 5,
    async execute(bot, message) {

        const topggVoted = await bot.topggClient.hasVoted(message.author.id);
        const bfdVoted = await bot.bfdClient.getBotVotes();

        const embed = new Discord.MessageEmbed()
            .setAuthor('Vote for me to get some coins', bot.user.displayAvatarURL())
            .setColor('#00ff00')
            .setDescription(`${!topggVoted?'<:TEyes:522434534139232256> You can **now** vote for me on [top.gg](https://top.gg/bot/585142238217240577/vote).':'<:TEno:522434586521763850> You have already voted for me on [top.gg](https://top.gg/bot/585142238217240577/vote) in the past **12 hours**.'}\n\n` +
                `${!bfdVoted.hasVoted24.includes(message.author.id)?'<:TEyes:522434534139232256> You can **now** vote for me on [botsfordiscord.com](https://botsfordiscord.com/bot/585142238217240577/vote).':'<:TEno:522434586521763850> You have already voted for me on [botsfordiscord.com](https://botsfordiscord.com/bot/585142238217240577/vote) in the past **24 hours**.'}`);
        message.channel.send(embed).catch(() => {});

    }
};