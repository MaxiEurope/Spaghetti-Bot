require('dotenv').config()
const Coins = require('../util/mongo/coins.js');

module.exports = {
    name: 'give',
    cooldown: 2,
    async execute(bot, message, args) {

        if (message.author.id !== '393096318123245578' || message.author.id !== '335489881163825152') return;
        let user;
        try {
            user = bot.users.get(args[0]).id;
        } catch (e) {
            user = 'no';
        }
        if (user === 'no') return message.channel.send('🚫 Invalid user ID!');
        let amount = args[1];
        if(!amount || isNaN(amount)) return message.channel.send('🚫 Invalid amount.');
        Math.round(amount);

        Coins.findOne({
            userID: user
        }, (err, coins) => {
            if (err) console.log(err);

            if (!coins) {
                let ncoins = new Coins({
                    userID: message.author.id,
                    coins: amount,
                    getIndex: 0
                })
                ncoins.save().catch(err => console.log(err));
            } else {
                coins.coins = amount;
                coins.save().catch(err => console.log(err));
            }
            message.channel.send('yesss');
        })

    },
};