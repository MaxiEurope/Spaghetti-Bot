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
        let multi = 1;
        if (Date.now() % 10 === 0) {
            multi += Math.random();
            if (wonSave > 0) {
                wonSave = Math.round(wonSave * multi);
                won = Math.round(won * multi);
            }
        }
        await util.addCoins(message.author.id, wonSave);

        const embed = {
            author: {
                name: 'SLOTS',
                icon_url: message.author.displayAvatarURL({dynamic: true})
            },
            description: `${bot.clear} **>** ${moveEmoji} ${moveEmoji} ${moveEmoji} **<**`,
            color: '#fbdca3',
            footer: {
                text: multi > 1 ? `🍀 Multi: ${multi * 100}` : null
            }
        };

        /** message */
        const msg = await message.channel.send({embed: embed}).catch(() => {});

        await wait(700);
        embed.description = `${bot.clear} **>** ${res[0]} ${moveEmoji} ${moveEmoji} **<**`;
        await msg.edit({embed: embed}).catch(() => {});

        await wait(700);
        embed.description = `${bot.clear} **>** ${res[0]} ${res[1]} ${moveEmoji} **<**`;
        await msg.edit({embed: embed}).catch(() => {});

        await wait(700);
        embed.description = `${bot.clear} **>** ${res[0]} ${res[1]} ${res[2]} **<**\n\n**${message.author.username}**, ${win ? `you won **${util.comma(won)}** ${bot.coin}!` : ' you lost...'}\nYou've got **${util.comma(await util.addCoins(message.author.id, 0))}** ${bot.coin}.`;
        embed.color = win ? '#3f8009' : '#d22b0f';
        await msg.edit({embed: embed}).catch(() => {});

    },
};