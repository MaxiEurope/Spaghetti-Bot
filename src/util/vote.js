exports.handler = (bot) => {

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

        const body = JSON.parse(req.body);
        const multi = [0, 6].includes(new Date().getDay()) ? 3 : 1;
        const rndCoins = Math.round(Math.random() * (33333 - 22222 + 1) + 22222) * multi;

        await util.addCoins(body.user, rndCoins);
        const user = await util.getUser(bot, body.user);
        if (user) {
            try {
                user.send(`🍝 **Thank you for voting!** You received **${util.comma(rndCoins)}** ${bot.coin}`).catch(() => {});
                const info = {
                    color: '#79bfeb',
                    author: {
                        name: `New vote - ${user.tag} (${user.id})`,
                        icon_url: user.displayAvatarURL({dynamic: true})
                    },
                    description: `🍝 **Thank you for voting!** You received **${util.comma(rndCoins)}** ${bot.coin}`,
                    footer: {
                        text: 'Voted at'
                    },
                    timestamp: new Date(Date.now())
                };
                await (await bot.channels.fetch(process.env.LOG_CHANNEL)).send({embed: info});
            } catch (e) {
                //
            }
        }

        res.status(200).send({
            status: 200
        });

    });

    app.get('/', (req, res) => {
        res.status(200).sendFile('index.html', {
            root: __dirname
        });
    });

    app.listen(process.env.PORT, () => {
        util.log(`Server started on port ${process.env.PORT}`);
    });

};