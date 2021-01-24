const Coins = require('../util/mongo/coins.js');
const util = require('../util/util.js');

module.exports = {
    name: 'coins',
    aliases: ['coin', 'balance', 'money', 'cash', 'bal'],
    description: 'Check your current coin balance.',
    cooldown: 2,
    async execute(bot, message) {

        const res = await Coins.findOne({
            userID: message.author.id
        });
        
        let c = 0;
        if (res !== null) {
            c = res.coins;
        }

        message.reply(`You've got **${util.comma(c)}** ${bot.coin}.`).catch(() => {});

    },
};