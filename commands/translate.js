const translate = require('translate-google');
const lettercount = require('letter-count');

module.exports = {
    name: 'translate',
    description: 'Translate your message in whatever language you like. Example: `-translate Ciao /en`. If no language selected, english is the default one.',
    usage: '<text /<language>>',
    cooldown: 5,
    id: 14,
    async execute(bot, message, args) {

        if (!args.length) return message.channel.send('🚫 Translating **nothing** is equal to ⁉.');

        var language = args[args.length - 1];
        if (language.charAt(0) == '/') {
            language = language.substring(1);
            args.pop();
        } else {
            language = 'en';
        }

        let text = args.join(' ');
        let count = lettercount.count(text).chars;
        if (count > 500) return message.channel.send('🚫 Oof, **500** character is the **maximum**!');

        text = text.split(/(?=[?!.])/gi);
        text.push("");

        function avlang() {
            let langs = '';
            var done = false;
            for (let key in translate.languages) {
                if (key == "zu")
                    done = true;
                if (!done)
                    langs += "`" + key + "`-" + translate.languages[key] + "  ";
            }
            return langs;
        }

        try {
            translate(text, {
                to: language
            }).then(res => {
                message.channel.send('✅ Successfully translated **' + message.author.username + '\'s** message.\n➡ ' + res.join(' '))
            }).catch(e => {
                message.channel.send('🚫 Seems like an invalide language. Here\'s a list of supported languages:\n' + avlang());
            })
        } catch (e) {
            return message.channel.send('🚫 The translator API seems not working. We\'re sorry, try again later.');
        }


    },
};