const util = require('../util/util.js');

module.exports = {
    name: 'avatar',
    aliases: ['pfp'],
    example: ['sp!avatar @User'],
    description: 'Get an users (or your) profile picture.',
    usage: 'sp!avatar <user>',
    cooldown: 5,
    async execute(bot, message, args) {

        let user = message.author;

        if (args.length) {
            user = await util.getUser(bot, args[0]);
        }

        message.reply(`📸 Found **${user.tag}'s** avatar!`, {
            files: [{
                attachment: user.displayAvatarURL({
                    dynamic: true,
                    size: 4096,
                    name: 'avatar.webp'
                })
            }]
        }).catch(() => {});
    },
};