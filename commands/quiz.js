const fetch = require('node-fetch');
const he = require('he'); //html decoder
const Coins = require('../util/mongo/coins.js');

module.exports = {
    name: 'quiz',
    description: 'Do some quiz! Available categories: **general, games, computer, vehicles, history, tv, music**. Difficulties: **easy, medium, hard**. You will have 30 seconds! Example: `-quiz vehicles medium`',
    usage: '(category difficulty)',
    cooldown: 10,
    id: 12,
    async execute(bot, message, args) {

        let emojis = ['🤔', '❓', '💡', '🔬', '🗺', '📜', '🗒'];
        let rnd = emojis[Math.floor(Math.random() * emojis.length)];
        let category;
        let difficulty;
        let multiplier = 1;

        /**
         * general: 9, games: 15, computers: 18, vehicles: 28, history: 23, tv: 14, music: 12
         */
        if (!args[0]) {
            category = 9, difficulty = 'easy';
        } else {
            args[0] = args[0].toLowerCase();
            /**
             * category
             */
            if (args[0] === 'general') {
                category = 9;
            } else if (args[0] === 'games') {
                category = 15;
            } else if (args[0] === 'computers') {
                category = 18;
            } else if (args[0] === 'vehicles') {
                category = 28;
            } else if (args[0] === 'history') {
                category = 23;
            } else if (args[0] === 'tv') {
                category = 14;
            } else if (args[0] === 'music') {
                category = 12;
            } else {
                return message.channel.send('🚫 **' + args[0] + '** is not a valid category.\n' +
                    'Available categories: **general, games, computers, vehicles, history, tv, music**.');
            }
            /**
             * difficulty
             */
            if (!args[1]) {
                difficulty = 'easy';
            } else {
                args[1] = args[1].toLowerCase();
                if (args[1] === 'easy') {
                    difficulty = 'easy';
                } else if (args[1] === 'medium') {
                    difficulty = 'medium';
                } else if (args[1] === 'hard') {
                    difficulty = 'hard';
                } else {
                    return message.channel.send('🚫 **' + args[1] + '** is not a valid difficulty.\n' +
                        'Available difficulties: **easy, medium, hard**.');
                }
            }
        }

        /** multiplier */
        if (difficulty === 'easy') multiplier = 1;
        else if (difficulty === 'medium') multiplier = 2;
        else multiplier = 3;

        try {
            message.channel.startTyping();
            fetch(`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=boolean`)
                .then(async res => res.json())
                .then(async body =>
                    await message.channel.send(`${rnd} **Here's your question:**\n${he.decode(body.results[0].question)}`).then(async msg => {
                        let earnedMoney = 1;
                        let correct = false;
                        Coins.findOne({
                            userID: message.author.id
                        }, async (err, coins) => {
                            if (err) console.log(err);

                            let yes = '✅',
                                no = '⛔',
                                ended = false;
                            let mcontent = `${rnd} **Here's your question:**\n${he.decode(body.results[0].question)}`;
                            await msg.react(yes);
                            await msg.react(no);
                            await msg.channel.stopTyping();
                            let filter = (reaction, user) => (reaction.emoji.name === yes || reaction.emoji.name === no) && user.id === message.author.id;
                            let collector = await msg.createReactionCollector(filter, {
                                time: 30000
                            });
                            collector.on('collect', async function (c) {
                                if (c.emoji.name == yes) {
                                    if (body.results[0].correct_answer === 'True') {
                                        ended = true;
                                        earnedMoney = 10;
                                        correct = true;
                                        await msg.edit(mcontent + ' - edit: **' + body.results[0].correct_answer + '**' + '\n✅ That\'s **correct**! - ' +
                                            'difficulty: `' + difficulty + '` **+' + (earnedMoney * multiplier) + ' 💰**');
                                    } else {
                                        ended = true;
                                        earnedMoney = 1;
                                        correct = false;
                                        await msg.edit(mcontent + ' - edit: **' + body.results[0].correct_answer + '**' + '\n⛔ Aw, that\'s **wrong**! Try again. - ' +
                                            'difficulty: `' + difficulty + '` **+' + (earnedMoney * multiplier) + ' 💰**');
                                    }
                                    try {
                                        await msg.clearReactions();
                                    } catch (e) {
                                        console.log('quiz.js - no perms to remove reactions.');
                                    }
                                } else if (c.emoji.name == no) {
                                    if (body.results[0].correct_answer === 'False') {
                                        ended = true;
                                        earnedMoney = 10;
                                        correct = true;
                                        await msg.edit(mcontent + ' - edit: **' + body.results[0].correct_answer + '**' + '\n✅ Yay, you\'re **right**.! - ' +
                                            'difficulty: `' + difficulty + '` **+' + (earnedMoney * multiplier) + ' 💰**');
                                    } else {
                                        ended = true;
                                        earnedMoney = 1;
                                        correct = false;
                                        await msg.edit(mcontent + ' - edit: **' + body.results[0].correct_answer + '**' + '\n⛔ Aw, it was **false**. Try again. - ' +
                                            'difficulty: `' + difficulty + '` **+' + (earnedMoney * multiplier) + ' 💰**');
                                    }
                                    try {
                                        await msg.clearReactions();
                                    } catch (e) {
                                        console.log('quiz.js - no perms to remove reactions.');
                                    }
                                }
                                /** money */
                                if (!coins) {
                                    let ncoins = new Coins({
                                        userID: message.author.id,
                                        coins: 100,
                                        getIndex: 0
                                    })
                                    ncoins.save().catch(err => console.log(err));
                                } else {
                                    if (correct === true) {
                                        coins.coins = coins.coins + (earnedMoney * multiplier);
                                        coins.save().catch(err => console.log(err));
                                    } else {
                                        coins.coins = coins.coins + earnedMoney;
                                        coins.save().catch(err => console.log(err));
                                    }
                                }
                            })
                            collector.on('end', async function (ce) {
                                if (ended === false) {
                                    await msg.edit('⏲ Aw, time expired. Try again!');
                                    try {
                                        await msg.clearReactions();
                                    } catch (e) {
                                        console.log('quiz.js - no perms to remove reactions.');
                                    }
                                    return;
                                }
                            });
                        })
                    }));
        } catch (e) {
            return message.channel.send('🚫 The quiz API seems not working. We\'re sorry, try again later.');
        }
    },
};