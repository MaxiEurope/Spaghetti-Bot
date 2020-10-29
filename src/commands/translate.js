const translate = require('translate-google');
const util = require('../util/util.js');

module.exports = {
    name: 'translate',
    example: ['sp!translate How are you? /de'],
    description: 'Translate your message in whatever language you like. English is the default language, if nothing else is chosen.',
    usage: 'sp!translate <text> (/language)',
    cooldown: 5,
    async execute(bot, message, args) {

        if (!args.length) return message.channel.send(`⛔ How about providing a message?\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});

        let language = args[args.length - 1];
        if (language.charAt(0) == '/') {
            language = language.substring(1);
            args.pop();
        } else {
            language = 'en';
        }

        let text = args.join(' ');
        const count = util.count(text).chars;
        if (count > 500) return message.channel.send('⛔ Oh no, your message exceeded the **500** character limit!').catch(() => {});

        text = text.split(/(?=[?!.])/gi);
        text.push('');

        translate(text, {
            to: language
        }).then(res => {
            message.channel.send(`✅ Translated **${message.author.tag}'s** message.\n${bot.clear} ${res.join(' ')}`).catch(() => {});
        }).catch(() => {
            message.channel.send('⛔ You provided an invalid language code. Language codes: https://imgur.com/a/kroNrwa').catch(() => {});
        });

    },
};