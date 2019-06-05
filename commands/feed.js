require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Coins = require('../util/mongo/coins.js');
const Feed = require('../util/mongo/feed.js');
const Bot = require('../util/mongo/bot.js');
let allfood = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':sweet_potato:', ':bento:', ':rice_cracker:', ':rice_ball:', ':rice:', ':curry:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':stew:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':dango:', ':custard:', ':honey_pot:', ':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':champagne_glass:', ':tumbler_glass:', ':kiwi:', ':grapes:', ':melon:', ':watermelon:', ':tangerine:', ':lemon:', ':banana:', ':pineapple:', ':apple:', ':green_apple:', ':pear:', ':peach:', ':cherries:', ':strawberry:', ':tomato:', ':eggplant:', ':corn:', ':hot_pepper:', ':mushroom:', ':avocado:', ':cucumber:', ':potato:', ':carrot:', ':chestnut:', ':peanuts:'];

function emitEmoji(count) {
    let emit = '',
        res;
    for (let i = 0; i < count; i++) {
        res = allfood[Math.floor(Math.random() * allfood.length)];
        emit += res;
    }
    return emit;
}

module.exports = {
    name: 'feed',
    description: 'Feed me to get money and climb the leaderboard.',
    cooldown: 5,
    async execute(bot, message, args) {

        Coins.findOne({
            userID: message.author.id
        }, (err, coins) => {
            if (err) console.log(err);

            if (!coins) {
                return message.channel.send('Ugh, you have no money.\nTry using the daily command.');
            } else {
                if (coins.coins < 2) {
                    return message.channel.send('Ugh, you have not enough money. You need **2** coins.');
                } else {
                    let count = 1;
                    let finalCount;
                    let extraRound = '';
                    if (Math.round(Math.random() * 100) > 50) count = 2;
                    Feed.findOne({
                        userID: message.author.id
                    }, (err, feed) => {
                        if (err) console.log(err);
                        if (!feed) {
                            let nfeed = new Feed({
                                userID: message.author.id,
                                totalFeeds: count,
                                multiTF: false,
                                multi: 0,
                                multiRounds: 0
                            })
                            nfeed.save().catch(err => console.log(err));
                        } else {
                            if (feed.multiTF === true && feed.multiRounds > 0) {
                                finalCount = count * feed.multi;
                                feed.multiRounds = feed.multiRounds - 1;
                                feed.totalFeeds = feed.totalFeeds + finalCount;
                                feed.save().catch(err => console.log(err));
                                extraRound = '`' + feed.multiRounds + '/10`';
                            } else {
                                feed.multiTF = false;
                                feed.multi = 0;
                                feed.multiRounds = 0;
                                finalCount = count;
                                feed.totalFeeds = feed.totalFeeds + finalCount;
                                feed.save().catch(err => console.log(err));
                            }
                        }
                        Bot.findOne({
                            botID: bot.user.id
                        }, (err, bbot) => {
                            if (err) console.log(err);
                            if (!bbot) {
                                let nbbot = new Bot({
                                    botID: bot.user.id,
                                    totalGFeeds: finalCount
                                })
                                nbbot.save().catch(err => console.log(err));
                            } else {
                                bbot.totalGFeeds = bbot.totalGFeeds + finalCount;
                                bbot.save().catch(err => console.log(err));
                            }
                            coins.coins = coins.coins + (finalCount - 2);
                            coins.save().catch(err => console.log(err));
                            message.channel.send('🤤 YUM! You fed me ' + emitEmoji(finalCount) + '! **+' + finalCount + ' points** ' + extraRound);
                        })
                    })
                }
            }
        })
    },
};