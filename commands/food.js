/**
 * Food Arrays
 */
let allfood = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':sweet_potato:', ':bento:', ':rice_cracker:', ':rice_ball:', ':rice:', ':curry:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':stew:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':dango:', ':custard:', ':honey_pot:', ':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':champagne_glass:', ':tumbler_glass:', ':kiwi:', ':grapes:', ':melon:', ':watermelon:', ':tangerine:', ':lemon:', ':banana:', ':pineapple:', ':apple:', ':green_apple:', ':pear:', ':peach:', ':cherries:', ':strawberry:', ':tomato:', ':eggplant:', ':corn:', ':hot_pepper:', ':mushroom:', ':avocado:', ':cucumber:', ':potato:', ':carrot:', ':chestnut:', ':peanuts:'];
let fruit = [':strawberry:', ':cherries:', ':peach:', ':pear:', ':green_apple:', ':apple:', ':pineapple:', ':banana:', ':lemon:', ':tangerine:', ':watermelon:', ':melon:', ':grapes:', ':kiwi:'];
let vegetables = [':carrot:', ':potato:', ':cucumber:', ':avocado:', ':mushroom:', ':hot_pepper:', ':corn:', ':eggplant:', ':tomato:'];
let other = [':pizza:', ':hamburger:', ':fries:', ':hotdog:', ':popcorn:', ':bacon:', ':egg:', ':pancakes:', ':cooking:', ':bread:', ':croissant:', ':french_bread:', ':cheese:', ':salad:', ':stuffed_flatbread:', ':taco:', ':burrito:', ':meat_on_bone:', ':poultry_leg:', ':bento:', ':rice_cracker:', ':rice:', ':ramen:', ':sushi:', ':fried_shrimp:', ':fish_cake:', ':oden:', ':shallow_pan_of_food:', ':spaghetti:', ':icecream:', ':shaved_ice:', ':ice_cream:', ':doughnut:', ':cookie:', ':birthday:', ':cake:', ':chocolate_bar:', ':candy:', ':lollipop:', ':custard:', ':honey_pot:'];
let drink = [':milk:', ':coffee:', ':tea:', ':champagne:', ':wine_glass:', ':cocktail:', ':tropical_drink:', ':beer:', ':beers:', ':champagne_glass:', ':tumbler_glass:'];

module.exports = {
    name: 'food',
    aliases: ['getfood', 'f'],
    description: 'Get some random food. Available types: fruit, vegetable, drink, other. If no parameter given, random food will be chosen.',
    usage: '(type)',
    cooldown: 1,
    async execute(bot, message, args) {

        let res;
        if (!args[0]) {
            res = allfood[Math.floor(Math.random() * allfood.length)]; //wenn keine args

        } else {
            args[0] = args[0].toLowerCase(); //alles klein für mobile users
            if (args[0] === 'fruit' || args[0] === 'fruits') {
                res = fruit[Math.floor(Math.random() * fruit.length)];
            } else if (args[0] === 'vegetable' || args[0] === 'vegetables') {
                res = vegetables[Math.floor(Math.random() * vegetables.length)];
            } else if (args[0] === 'drink' || args[0] === 'drinks') {
                res = drink[Math.floor(Math.random() * drink.length)];
            } else if (args[0] === 'other' || args[0] === 'other') {
                res = other[Math.floor(Math.random() * other.length)];
            } else {
                res = allfood[Math.floor(Math.random() * allfood.length)]; //wenn undefined args
            }
        }

        message.channel.send('😋 I gave you **' + res + '**! Enjoy.'); //send

    },
};