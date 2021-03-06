const util = require('../util/util.js');

module.exports = {
    name: 'give',
    aliases: ['share'],
    example: ['sp!give @User 100'],
    description: 'Share some coins (100k max).',
    usage: 'sp!give <user> <coins>',
    cooldown: 15,
    async execute(bot, message, args) {

        if (!args.length) return message.reply(`ℹ Example: \`${this.example.join('`\n`')}\``).catch(() => {});

        const user = await util.getUser(bot, args[0]);
        if (!user) return message.reply(`⛔ User not found!\nℹ Example: \`${this.example.join('` `')}\``).catch(() => {});

        if (user.id === message.author.id) return message.reply('❓ Why tho').catch(() => {});

        let amount = 0;
        if (!util.isNum(args[1])) {
            if (['all', 'max'].some(e => args[1].toLowerCase() === e)) {
                if (coins > 100000) {
                    amount = 100000;
                } else {
                    amount = coins;
                }
            } else {
                amount = 1;
            }
        } else {
            amount = parseInt(Math.round(args[1]));
        }

        if (amount < 1) {
            amount = 1;
        } else if (amount > 100000) {
            amount = 100000;
        }

        async function give(money) {
            if (money < amount) {
                return message.reply(`⛔ You were about to give **${user.tag}** **${util.comma(amount)}** ${bot.coin}, but you've got only **${util.comma(money)}** ${bot.coin}!`).catch(() => {});
            }

            await util.addCoins(message.author.id, amount * (-1));
            const receiverCoins = await util.addCoins(user.id, amount);

            message.reply(`✅ You gave **${user.tag}** **${util.comma(amount)}** ${bot.coin}. They now have **${util.comma(receiverCoins)}** ${bot.coin}.`).catch(() => {});
            try {
                user.send(`👋 Hey, **${message.author.tag}** gave you **${util.comma(amount)}** ${bot.coin}!`);
            } catch (e) {
                return;
            }
        }

        const coins = await util.addCoins(message.author.id, 0);

        give(coins);

    },
};