const Discord = require('discord.js-light');
const fetch = require('node-fetch');
const he = require('he');
const util = require('../util/util.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'quiz',
    description: 'Do some quiz! You\'ll get 15 seconds to answer it!',
    cooldown: 15,
    async execute(bot, message) {

        const abcd = ['🇦', '🇧', '🇨', '🇩'];
        const url = 'https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple';
        let multiplier = 0;
        let ended = false;
        let res = 0;

        try {

            message.channel.startTyping();
            fetch(url)
                .then(res => res.json())
                .then(async body => {
                    const difficulty = body.results[0].difficulty;
                    const category = body.results[0].category;
                    const question = he.decode(body.results[0].question);
                    const correctAnswer = body.results[0].correct_answer;
                    let answers = body.results[0].incorrect_answers;
                    answers.push(correctAnswer);
                    /** shuffle */
                    answers = util.shuffle(answers);
                    /** get difficulty */
                    if (difficulty === 'easy') multiplier = 1;
                    if (difficulty === 'medium') multiplier = 2;
                    if (difficulty === 'hard') multiplier = 3;

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`${message.author.tag}'s question`, message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setTitle(question)
                        .setDescription('\n\n' +
                            `**[A]** __${answers[0]}__\n` +
                            `**[B]** __${answers[1]}__\n` +
                            `**[C]** __${answers[2]}__\n` +
                            `**[D]** __${answers[3]}__`)
                        .addField('Category', category, true)
                        .addField('Difficulty', difficulty, true)
                        .setColor('#00ff00');

                    message.channel.send('React with the correct emoji below.', embed).then(async msg => {
                        message.channel.stopTyping();
                        const start = Date.now();
                        abcd.forEach(async e => {
                            await wait(250);
                            await msg.react(e).catch(() => {});
                        });

                        const reactionFilter = (reaction, user) => (abcd.includes(reaction.emoji.name)) && user.id === message.author.id;
                        const reactionCollector = await msg.createReactionCollector(reactionFilter, {
                            time: 15000
                        });

                        reactionCollector.once('collect', async r => {
                            ended = true;
                            const index = abcd.indexOf(r.emoji.name);

                            if (answers[index] === correctAnswer) {
                                res = 15000-Math.round(((Date.now() - start) / 2000) * multiplier);
                                msg.edit(`🎉 Correct! You got **${util.comma(res)}** ${bot.coin}.`, {
                                    embed: null
                                }).catch(() => {});
                            } else {
                                res = (1000 * multiplier) * (-1);
                                msg.edit(`😒 Wrong! You lost **${util.comma(res*(-1))}** ${bot.coin}.`, {
                                    embed: null
                                }).catch(() => {});
                            }
                            await util.addCoins(message.author.id, res);
                            msg.reactions.removeAll().catch(() => {});
                        });

                        reactionCollector.on('end', () => {
                            if (!ended) {
                                msg.edit('😒 You ran out of time.', {
                                    embed: null
                                }).catch(() => {});
                                msg.reactions.removeAll().catch(() => {});
                            }
                        });

                    }).catch(() => {});
                });
        } catch (e) {
            return message.channel.send('⛔ Oh no! The API I\'m using seems to be down 😒');
        }

    },
};