require('dotenv').config()
const Coins = require('../util/mongo/coins.js');
const User = require('../util/mongo/user.js');
const moment = require('moment-timezone');
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
    cooldown: 15,
    id: 5,
    async execute(bot, message) {

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
                    text += 'Here is your daily **100** 💰.';
                    total = 100;
                } else if (user.dailyLast > moment().tz('Europe/Vienna').startOf('day')) {
                    return message.channel.send('⏰ You next daily is in **' + gNow() + '**');
                } else {
                    total = 100 + (user.dailyMulti * user.dailyStreak);
                    text += 'Here is your daily **' + total + '** 💰.';
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