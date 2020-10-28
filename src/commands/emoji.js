const emoji = require('node-emoji');
const responses = ['OwO', 'Emoji g0d', '😏', ':)', 'Here ya go', '(:', ':-)', ':D', '^_^', 'UwU', ';-)', ':P', 'O.O'];
const util = require('../util/util.js');

module.exports = {
    name: 'emoji',
    aliases: ['randomemoji'],
    example: ['-emoji 100'],
    description: 'Want some emojis? lol',
    usage: '-emoji (count)',
    cooldown: 2,
    async execute(bot, message, args) {

        const rnd = Math.floor(Math.random() * responses.length);

        if (!args.length) {
            message.channel.send(`**${responses[rnd]}** Your emoji: ${emoji.random().emoji}`).catch(() => {});
        } else {
            if (!util.isNum(args[0])) {
                message.channel.send(`**${responses[rnd]}** Your emoji: ${emoji.random().emoji}`).catch(() => {});
            } else {
                let res = [];
                for (let i = 0; i < ((args[0] < 1 || args[0] > 100) ? 20 : args[0]); i++) {
                    res.push(emoji.random().emoji);
                }
                message.channel.send(`**${responses[rnd]}** Some emojis I found: ${res.join('')}`).catch(() => {});
            }
        }

    },
};