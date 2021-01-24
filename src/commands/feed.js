const Feed = require('../util/mongo/feed.js');
const allfood = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':sweet_potato:', ':bento:', ':rice_cracker:', ':rice_ball:', ':rice:', ':curry:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':stew:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':dango:', ':custard:', ':honey_pot:', ':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':champagne_glass:', ':tumbler_glass:', ':kiwi:', ':grapes:', ':melon:', ':watermelon:', ':tangerine:', ':lemon:', ':banana:', ':pineapple:', ':apple:', ':green_apple:', ':pear:', ':peach:', ':cherries:', ':strawberry:', ':tomato:', ':eggplant:', ':corn:', ':hot_pepper:', ':mushroom:', ':avocado:', ':cucumber:', ':potato:', ':carrot:', ':chestnut:', ':peanuts:'];
const util = require('../util/util.js');

module.exports = {
    name: 'feed',
    description: 'Spam this command to climb the leaderboard.',
    cooldown: 5,
    async execute(bot, message) {

        const rndEmo = allfood[Math.floor(Math.random() * allfood.length)];
        const rndCoi = Math.round(Math.random() * (14 - 9 + 1) + 9);

        await util.addCoins(message.author.id, rndCoi);
        const now = await util.addFeed(message.author.id, 1);

        const total = await Feed.aggregate([{
            $group: {
                _id: null,
                total: {
                    $sum: {
                        $add: ['$total']
                    }
                }
            }
        }]).exec();

        message.reply(`😋 You gave <:TEwumpusCrown:710996351042846720> **Wumpus** 1x ${rndEmo}. (+ **${rndCoi}** ${bot.coin})\n` +
            `${bot.clear} [your/global] points: \`[${util.comma(now)}/${util.comma(total[0].total)}]\``).catch(() => {});

    },
};