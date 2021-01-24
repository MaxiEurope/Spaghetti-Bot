/** food */
const food = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':sweet_potato:', ':bento:', ':rice_cracker:', ':rice_ball:', ':rice:', ':curry:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':stew:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':dango:', ':custard:', ':honey_pot:', ':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':champagne_glass:', ':tumbler_glass:', ':kiwi:', ':grapes:', ':melon:', ':watermelon:', ':tangerine:', ':lemon:', ':banana:', ':pineapple:', ':apple:', ':green_apple:', ':pear:', ':peach:', ':cherries:', ':strawberry:', ':tomato:', ':eggplant:', ':corn:', ':hot_pepper:', ':mushroom:', ':avocado:', ':cucumber:', ':potato:', ':carrot:', ':chestnut:', ':peanuts:'];
const fruits = [':strawberry:', ':cherries:', ':peach:', ':pear:', ':green_apple:', ':apple:', ':pineapple:', ':banana:', ':lemon:', ':tangerine:', ':watermelon:', ':melon:', ':grapes:', ':kiwi:'];
const vegetables = [':carrot:', ':potato:', ':cucumber:', ':avocado:', ':mushroom:', ':hot_pepper:', ':corn:', ':eggplant:', ':tomato:'];
const fatfood = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':bento:', ':rice_cracker:', ':rice:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':custard:', ':honey_pot:'];
const drinks = [':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':beers:', ':champagne_glass:', ':tumbler_glass:'];

module.exports = {
    name: 'food',
    aliases: ['randomfood'],
    example: ['sp!food fruits'],
    description: 'I\'ll give you some random food. Available categories: `fruits`, `vegetables`, `drinks`, `fatfood`... yea, fatfood. Some hamburgers will make you feel fat.',
    usage: 'sp!food (category)',
    cooldown: 1,
    async execute(bot, message, args) {

        let res;
        if (!args.length) {
            res = food[Math.floor(Math.random() * food.length)];
        } else {
            const type = args[0].toLowerCase();
            if (type === 'fruits') {
                res = fruits[Math.floor(Math.random() * fruits.length)];
            } else if (type === 'vegetables') {
                res = vegetables[Math.floor(Math.random() * vegetables.length)];
            } else if (type === 'drinks') {
                res = drinks[Math.floor(Math.random() * drinks.length)];
            } else if (type === 'fatfood') {
                res = fatfood[Math.floor(Math.random() * fatfood.length)];
            } else {
                res = food[Math.floor(Math.random() * food.length)];
            }
        }

        message.reply(`😋 Here's some ${res}, enjoy!`).catch(() => {});

    },
};