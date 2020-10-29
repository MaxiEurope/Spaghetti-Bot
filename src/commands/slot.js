const util = require('../util/util.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'slot',
    aliases: ['slots', 's'],
    example: ['sp!slots 100'],
    description: 'Spin the wheel.',
    usage: 'sp!slots <coins>',
    cooldown: 10,
    async execute(bot, message, args) {

        const coins = await util.addCoins(message.author.id, 0);

        if (!args.length) return message.channel.send(`ℹ Example: \`${this.example.join('` `')}\``).catch(() => {});

        let amount = 0;
        if (!util.isNum(args[0])) {
            amount = 1;
        } else {
            amount = parseInt(Math.round(args[0]));
        }

        if (amount < 1) {
            amount = 1;
        }

        if (coins < amount) {
            return message.channel.send(`⛔ You were about to play slots with **${util.comma(amount)}** ${bot.coin} while only having **${util.comma(coins)}** ${bot.coin}!`).catch(() => {});
        }

        let charts = ['🍇', '🔔', '🍒', '🍉', '💎'];
        let moveEmoji = '<a:slots:594190009150472192>';
        let res = [];
        let won = 0;
        let win = false;
        let slot = Math.random();

        /** slots */
        if (slot <= .20) {
            win = true;
            won = amount;
            res.push(charts[0]);
            res.push(charts[0]);
            res.push(charts[0]);
        } else if (slot <= .40) {
            win = true;
            won = amount * 2;
            res.push(charts[1]);
            res.push(charts[1]);
            res.push(charts[1]);
        } else if (slot <= .45) {
            win = true;
            won = amount * 3;
            res.push(charts[2]);
            res.push(charts[2]);
            res.push(charts[2]);
        } else if (slot <= .475) {
            win = true;
            won = amount * 4;
            res.push(charts[3]);
            res.push(charts[3]);
            res.push(charts[3]);
        } else if (slot <= .485) {
            win = true;
            won = amount * 10;
            res.push(charts[4]);
            res.push(charts[4]);
            res.push(charts[4]);
        } else {
            won = 0;
            let slot1 = Math.floor(Math.random() * (charts.length - 1));
            let slot2 = Math.floor(Math.random() * (charts.length - 1));
            let slot3 = Math.floor(Math.random() * (charts.length - 1));
            if (slot3 == slot1)
                slot2 = (slot1 + Math.ceil(Math.random() * (charts.length - 2))) % (charts.length - 1);
            if (slot2 == charts.length - 2)
                slot2++;
            res.push(charts[slot1]);
            res.push(charts[slot2]);
            res.push(charts[slot3]);
        }

        /** save money */
        const wonSave = won - amount;
        await util.addCoins(message.author.id, wonSave);

        /** message */
        const lastMsg = `**${message.author.username}** bet **${util.comma(amount)}** ${bot.coin} and won ${(win === true)?`**${util.comma(won)}** ${bot.coin}`:'nothing 😒'}`;

        message.channel.send(`**\\> SLOTS**\n${moveEmoji} ${moveEmoji} ${moveEmoji}\n\`|       |\``).then(async msg => {
            await wait(800);
            msg.edit(`**\\> SLOTS**\n${res[0]} ${moveEmoji} ${moveEmoji}\n\`|       |\``).catch(() => {});
            await wait(800);
            msg.edit(`**\\> SLOTS**\n${res[0]} ${res[1]} ${moveEmoji}\n\`|       |\``).catch(() => {});
            await wait(800);
            msg.edit(`**\\> SLOTS**\n${res[0]} ${res[1]} ${res[2]}\n\`|   ${(win===true)?'😃':'😔'}   |\`\n\n${lastMsg}`).catch(() => {});
        }).catch(() => {});

    },
};