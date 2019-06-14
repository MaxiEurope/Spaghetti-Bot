module.exports = {
    name: 'avatar',
    aliases: ['pfp'],
    description: 'Get your or the mentioned users avatar.',
    usage: '(@User)',
    cooldown: 5,
    id: 2,
    async execute(bot, message, args) {

        let user = message.mentions.users.first() || message.author;
        message.channel.send(`This is **${user.tag}**'s avatar!`, {
            files: [user.displayAvatarURL.split("?")[0]]
        })

    },
};