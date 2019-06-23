require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Coins = require('../util/mongo/coins.js');
const User = require('../util/mongo/user.js');
const moment = require('moment');
const tz = require('moment-timezone');
let total = 0;
let text = '';

function gNow() {
    let t = moment().tz('Europe/Vienna').endOf('day') - Date.now();
    let duration = moment.duration(t).format("H[H],m[M],s[S]");
    return duration;
}

module.exports = {
    name: 'daily',
    description: 'Get your daily amount of coins every 24 h. Resets at midnight (timezone: Vienna/Europe).',
    cooldown: 10,
    id: 5,
    async execute(bot, message, args) {

        User.findOne({
            userID: message.author.id
        }, (err, user) => {
            if (err) console.log(err);
            Coins.findOne({
                userID: message.author.id
            }, (err, coins) => {
                if (err) console.log(err);

                /**
                 * Daily
                 */

                if (!user) {
                    let nuser = new User({
                        userID: message.author.id,
                        dailyMulti: 5,
                        dailyStreak: 1,
                        dailyLast: Date.now(),
                        patreonTF: false
                    })
                    nuser.save().catch(err => console.log(err));
                    text += 'Here are your daily **100** 💰.\nGet your next daily in **' + gNow() + '**.';
                    total = 100;
                } else if (user.dailyLast > moment().tz('Europe/Vienna').startOf('day')) {
                    return message.channel.send('⏰ You next daily is in **' + gNow() + '**');
                } else {
                    total = 100 + (user.dailyMulti * user.dailyStreak);
                    text += 'Here are your daily **' + total + '** 💰.\nGet your next daily in **' + gNow() + '**.';
                    user.dailyLast = Date.now();
                    user.dailyStreak = user.dailyStreak + 1;
                    user.save().catch(err => console.log(err));
                }

                /**
                 * Money
                 */

                if (!coins) {
                    let ncoins = new Coins({
                        userID: message.author.id,
                        coins: 100,
                        getIndex: 0
                    })
                    ncoins.save().catch(err => console.log(err));
                } else {
                    coins.coins = coins.coins + 100;
                    coins.save().catch(err => console.log(err));
                }

                /**
                 * Message
                 */

                message.channel.send(text);

            })
        })

    },
};