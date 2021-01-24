const fetch = require('node-fetch');

module.exports = {
    name: 'advice',
    description: 'Give you some really helpful advice.',
    cooldown: 5,
    async execute(bot, message) {

        const emojis = ['🤵', '💁', '👁', '🤞', '🕯', '🏝'];
        const rnd = emojis[Math.floor(Math.random() * emojis.length)];

        try {
            fetch('https://api.adviceslip.com/advice')
                .then(res => res.json())
                .then(body => message.reply(`${rnd} **${body.slip.advice}**`));
        } catch (e) {
            return message.reply('⛔ Oh no! `adviceslip.com` seems to be down atm 😒');
        }
    },
};