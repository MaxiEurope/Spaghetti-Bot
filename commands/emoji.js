const emoji = require('node-emoji');

module.exports = {
    name: 'rndemoji',
    aliases: ['randomemoji'],
    description: 'Get some random emojis! You can use the extra argument **count**, ex.: `-rndemoji 5`, to get 5 random emojis.',
    usage: '(count)',
    cooldown: 1,
    id: 6,
    async execute(bot, message, args) {

        let responses = ['UWU', 'Emoji maaaaster', 'Yay :3', ':) Here you go', 'You like emojis, huh (:', '°w°', 'Hihi', 'Baaaam'];
        let rnd = Math.floor(Math.random() * responses.length);
        let count;
        if (!args[0]) {
            count = 1;
            return message.channel.send(responses[rnd] + ', here\'s your random emoji: ' + emoji.random().emoji);
        } else {
            args[0] = args[0].toLowerCase();
            if (isNaN(args[0])) {
                count = 1;
                return message.channel.send(responses[rnd] + ', here\'s your random emoji: ' + emoji.random().emoji);
            } else {
                Math.round(args[0]);
                if (args[0] < 1 || args[0] > 50) return message.channel.send('😒 OOF, make sure your number is between **1 and 50**!');
                count = args[0];

                return message.channel.send(responses[rnd] + plural(count) + returnemoji(count));
            }
        }

    },
};

function plural(count) {
    let res = ', here is your random emoji: ';
    if (count >= 2) res = ', here are your random emojis: ';
    return res;
}

function returnemoji(count) {
    let res = '';
    for (let i = 0; i < count; i++) {
        res += emoji.random().emoji;
    }
    return res;
}