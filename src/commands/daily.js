const Daily = require('../util/mongo/daily.js');
const moment = require('moment');
const util = require('../util/util.js');

module.exports = {
    name: 'daily',
    description: 'Claim your daily amount of coins every 24 hours obviously.',
    cooldown: 5,
    async execute(bot, message) {

        let total = 2500;

        const res = await Daily.findOne({
            userID: message.author.id
        });

        if (res === null) {
            new Daily({
                userID: message.author.id,
                last: Date.now(),
                streak: 0
            }).save().catch(() => {});
            message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`0\` daily streak)`).catch(() => {});
            await util.addCoins(message.author.id, total);
        } else {
            if ((res.last + 172800000) < Date.now()) {
                Daily.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    streak: 0,
                    last: Date.now()
                });
                message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`0\` daily streak)`).catch(() => {});
                await util.addCoins(message.author.id, total);
            } else if ((res.last + 86400000) < Date.now()) {
                if (res.streak >= 30) {
                    total = 5000;
                } else {
                    total = 2500 + (res.streak * 83);
                }
                Daily.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    streak: res.streak + 1,
                    last: Date.now()
                });
                message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`${res.streak}\` daily streak)`).catch(() => {});
                await util.addCoins(message.author.id, total);
            } else {
                const dur = moment.duration((res.last+86400000) - Date.now()).format(' H [H], m [M], s [S]', {
                    trim: 'both'
                });
                message.channel.send(`⛔ You can claim your daily in ${dur}.`).catch(() => {});
            }
        }

    },
};