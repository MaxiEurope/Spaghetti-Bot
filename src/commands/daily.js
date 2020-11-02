const Daily = require('../util/mongo/daily.js');
const moment = require('moment');
const util = require('../util/util.js');

module.exports = {
    name: 'daily',
    description: 'Claim some coins every 24 hours.',
    cooldown: 5,
    async execute(bot, message) {

        let total = 2500;

        const res = await Daily.findOne({
            userID: message.author.id
        });

        if (res === null) {
            await new Daily({
                userID: message.author.id,
                last: Date.now(),
                streak: 1
            }).save().catch(() => {});
            message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`1\` daily streak)`).catch(() => {});
            await util.addCoins(message.author.id, total);
        } else {
            if ((Date.now() - res.last) > 172800000) {
                await util.addCoins(message.author.id, total);
                await Daily.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    streak: 1,
                    last: Date.now()
                });
                message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`1\` daily streak)`).catch(() => {});
            } else if ((Date.now() - res.last) > 86400000) {
                total = 2500 + (res.streak * 83);
                await util.addCoins(message.author.id, total);
                await Daily.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    streak: res.streak + 1,
                    last: Date.now()
                });
                message.channel.send(`✅ Daily claimed, you received **${util.comma(total)}** ${bot.coin}. (\`${res.streak+1}\` daily streak)`).catch(() => {});
            } else {
                const dur = moment.duration((res.last + 86400000) - Date.now()).format(' H [H], m [M], s [S]', {
                    trim: 'both'
                });
                message.channel.send(`⛔ You can claim your daily in **${dur}**.`).catch(() => {});
            }
        }

    },
};