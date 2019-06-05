const emoji = require('node-emoji');

module.exports = {
    name: 'emoji',
    aliases: ['rnd'],
    description: 'Get some random emojis! Use the extra argument `count`, ex.: 5, to get 5 random emojis.',
    usage: '(count)',
    cooldown: 1,
    async execute(bot, message, args) {

        let responses = ['UWU', 'Emoji maaaaster', 'Yay :3', ':) Here you go', 'You like emojis, huh (:', '°w°', 'Hihi', 'Baaaam'];
        let rnd = Math.floor(Math.random() * responses.length);
        let count;
        if (!args[0]) {
            count = 1;
            return message.channel.send(responses[rnd] + ', here\'s your random emoji: ' + emoji.random().emoji);
        } else {
            args[0] = args[0].toLowerCase(); //alles klein für mobile users
            if (isNaN(args[0])) { //wenn args[0] keine nummer ist
                count = 1;
                return message.channel.send(responses[rnd] + ', here\'s your random emoji: ' + emoji.random().emoji);
            } else { //wenn doch
                Math.round(args[0]); //runden
                if (args[0] < 1 || args[0] > 25) return message.channel.send('😒 OOF, make sure your number is between **1 and 25**!'); //wenn die angebene nummer kleiner 1 oder größer 25 ist: return
                count = args[0];

                function returnemoji(count) {
                    let res = '';
                    for (let i = 0; i < count; i++) {
                        res += emoji.random().emoji;
                    }
                    return res;
                }
                return message.channel.send(responses[rnd] + ', here are your random emoji(s): ' + returnemoji(count));
            }
        }

    },
};