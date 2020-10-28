exports.handler = (bot, dbl) => {

    const util = require('./util.js');
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    app.use(bodyParser.text({
        type: '*/*'
    }));

    app.post('/webhook', async (req, res) => {
        if (!req.headers.authorization || req.headers.authorization !== process.env.VOTE_AUTH) {
            return res.status(401).send({
                status: 401
            });
        }

        res.status(200).send({
            status: 200
        });

        const body = JSON.parse(req.body);
        const multi = (await dbl.isWeekend()) ? 2 : 1;
        const rndCoins = Math.round(Math.random() * (1100 - 700 + 1) + 700) * multi;

        await util.addCoins(body.user, rndCoins);
        const user = await util.getUser(bot, body.user);
        if (user) {
            try {
                user.send(`🍝 **Thank you for voting!** You received **${util.comma(rndCoins)}** ${bot.coin}`);
            } catch (e) {
                return;
            }
        }

    });

    app.listen(process.env.PORT, () => {
        util.log(`Server started on port ${process.env.PORT}`);
    });

};