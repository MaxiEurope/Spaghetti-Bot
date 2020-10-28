const util = require('../util/util.js');

module.exports = {
    name: 'give',
    example: ['-give @User 100'],
    description: 'Share some coins with users.',
    usage: '-give <user> <coins>',
    cooldown: 15,
    async execute(bot, message, args) {

        if (!args.length) return message.channel.send(`ℹ Example: \`${this.example.join('`\n`')}\``).catch(() => {});

        const user = await util.getUser(bot, args[0]);
        if (!user) return message.channel.send(`⛔ User not found!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});

        if (user.id === message.author.id) return message.channel.send('❓ Why tho').catch(() => {});

        let amount = 0;
        if (!util.isNum(args[1])) {
            amount = 1;
        } else {
            amount = parseInt(Math.round(args[1]));
        }

        if (amount < 1) {
            amount = 1;
        }

        async function give(money) {
            if (money < amount) {
                return message.channel.send(`⛔ You were about to give ${user.tag} **${util.comma(amount)}** ${bot.coin}, but you've got only **${util.comma(money)}** ${bot.coin}!`).catch(() => {});
            }
            await util.addCoins(user.id, money);
            message.channel.send(`✅ You gave ${user.tag} **${util.comma(amount)}** ${bot.coin}`).catch(() => {});
            try {
                user.send(`👋 Hey, ${message.author.tag} gave you **${util.comma(amount)}** ${bot.coin}!`);
            } catch (e) {
                return;
            }
        }

        const coins = await util.addCoins(message.author.id, 0);

        give(coins);

    },
};