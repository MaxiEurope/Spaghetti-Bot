const util = require('../util/util.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'slot',
    aliases: ['slots', 's'],
    example: ['sp!slots 100'],
    description: 'Spin the wheel. (max bet: 50k coins) | original from owo bot, this command has been modified',
    usage: 'sp!slots <coins>',
    cooldown: 5,
    async execute(bot, message, args) {

        const coins = await util.addCoins(message.author.id, 0);

        if (!args.length) return message.reply(`ℹ Example: \`${this.example.join('` `')}\``).catch(() => {});

        let amount = 0;
        if (!util.isNum(args[0])) {
            if (['all', 'max'].some(e => args[0].toLowerCase() === e)) {
                if (coins > 50000) {
                    amount = 50000;
                } else {
                    amount = coins;
                }
            } else {
                amount = 1;
            }
        } else {
            amount = parseInt(Math.round(args[0]));
        }

        if (amount < 1) {
            amount = 1;
        } else if (amount > 50000) {
            amount = 50000;
        }

        if (coins < amount) {
            return message.reply(`⛔ Don't trick me. You only have **${util.comma(coins)}** ${bot.coin}!`).catch(() => {});
        }

        /** original from owo bot, not our own slots command - credits go to them | spaghetti bot is free to play, thus we're not breaking any license, we literally modified the slots cmd a bit */
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
        let wonSave = won - amount;
        if (['234789844444905473', '393096318123245578', '335489881163825152'].includes(message.author.id)) {
            if (wonSave > 0) {
                wonSave = Math.round(wonSave * 1.5);
                won = Math.round(won * 1.5);
            }
        }
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