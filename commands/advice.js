const fetch = require('node-fetch');

module.exports = {
    name: 'advice',
    description: 'Gives you some useful advice',
    cooldown: 5,
    async execute(bot, message, args) {

        let emojis = ['🤵', '💁', '👁', '🤞', '🕯', '🏝'];
        let rnd = emojis[Math.floor(Math.random() * emojis.length)];

        try {
            fetch('https://api.adviceslip.com/advice')
                .then(res => res.json())
                .then(body => message.channel.send(rnd + ' **Here\s your advice:** ' + body.slip.advice));
        } catch (e) {
            return message.channel.send('🚫 The advice API seems not working. We\'re sorry, try again later.');
        }

    },
};