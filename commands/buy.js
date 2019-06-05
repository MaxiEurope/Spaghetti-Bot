require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Coins = require('../util/mongo/coins.js');
const Feed = require('../util/mongo/feed.js');

module.exports = {
    name: 'buy',
    description: 'Buy a multiplier to feed me faster!',
    cooldown: 5,
    async execute(bot, message, args) {

        Coins.findOne({
            userID: message.author.id
        }, (err, coins) => {
            if (err) console.log(err);

            if (!coins) {
                return message.channel.send('Ugh, you have no money.\nTry using the daily command.');
            } else {
                if (!args.length || isNaN(args[0] === true)) {
                    return message.channel.send('😋 Hello **' + message.author.username + '**! Here you can buy multipliers to feed me faster.\n' +
                        '`-buy 1` - 🍨 multiplier *2 - cost 10/10 turns\n' +
                        '`-buy 2` - 🍰 multiplier *3 - cost 25/10 turns\n' +
                        '`-buy 3` - 🍕 multiplier *5 - cost 50/10 turns');
                } else {
                    Feed.findOne({
                        userID: message.author.id
                    }, (err, feed) => {
                        if (err) console.log(err);
                        if (!feed) {
                            return message.channel.send('🚫 You have never fed me. Try it at least once.');
                        } else {
                            if (feed.multiTF === true) {
                                return message.channel.send('🚫 You have already activated a multiplier.');
                            } else {
                                let minusM;
                                args[0] = Math.round(args[0]);
                                if (args[0] >= 1 && args[0] <= 3) {
                                    if (args[0] == 1 && coins.coins >= 10) {
                                        feed.multiTF = true;
                                        feed.multi = 2;
                                        feed.multiRounds = 10;
                                        minusM = 10;
                                    } else if (args[0] == 2 && coins.coins >= 25) {
                                        feed.multiTF = true;
                                        feed.multi = 3;
                                        feed.multiRounds = 10;
                                        minusM = 25;
                                    } else if (args[0] == 3 && coins.coins >= 50) {
                                        feed.multiTF = true;
                                        feed.multi = 5;
                                        feed.multiRounds = 10;
                                        minusM = 50;
                                    } else {
                                        return message.channel.send('Ugh, you have not enough coins.');
                                    }
                                }
                                coins.coins = coins.coins - minusM;
                                coins.save().catch(err => console.log(err));
                                feed.save().catch(err => console.log(err));
                                message.channel.send('😋 Successfully activated multiplier. **FEED ME NOW...**');
                            }
                        }
                    })
                }
            }
        })
    },
};