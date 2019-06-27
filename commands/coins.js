require('dotenv').config()
const Coins = require('../util/mongo/coins.js');

module.exports = {
    name: 'coins',
    aliases: ['coin', 'balance', 'money', 'cash'],
    description: 'View your current coin balance.',
    cooldown: 2,
    id: 4,
    async execute(bot, message, args) {

        Coins.findOne({
            userID: message.author.id
        }, (err, coins) => {
            if (err) console.log(err);

            if (!coins) {
                message.channel.send('🏦 Ugh, you have no money.\nTry using the daily command.');
            } else {
                message.channel.send('🏦 Your current coin balance: **' + coins.coins + '** 💰.');
            }

        })

    },
};