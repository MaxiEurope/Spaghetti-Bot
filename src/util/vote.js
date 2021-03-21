exports.handler = (bot, dbl) => {

    const util = require('./util.js');
    const express = require('express');
    const bodyParser = require('body-parser');
    const sharp = require('sharp');
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
        const multi = (await dbl.isWeekend()) ? 2 : 1;
        const rndCoins = Math.round(Math.random() * (1100 - 700 + 1) + 700) * multi;

        await util.addCoins(body.user, rndCoins);
        const user = await util.getUser(bot, body.user);
        if (user) {
            try {
                user.send(`🍝 **Thank you for voting!** You received **${util.comma(rndCoins)}** ${bot.coin}`).catch(() => {});
                const info = {
                    color: '#79bfeb',
                    author: {
                        name: `New vote - ${user.tag} (${user.id})`,
                        icon_url: user.iconURL({dynamic: true})
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

    /** this is just a test, pls ignore the code below */
    app.get('/color/:color?', async (req, res) => {
        const color = req.params.color;
        // const color = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`;
        if (!color) { return res.status(400).send('Bad request'); }
        if (!(/^#([0-9A-F]{3}){1,2}$/i).test(`#${color}`)) { return res.status(400).send('Bad request'); }
    
        const rgb = util.hexToRGB(`#${color}`);
    
        const img = await sharp({
            create: {
                width: 50,
                height: 50,
                channels: 3,
                background: {
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b
                }
            }
        }).png().toBuffer();
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
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