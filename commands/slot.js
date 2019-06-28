require('dotenv').config()
const Coins = require('../util/mongo/coins.js');
const cm = require('comma-number');

module.exports = {
    name: 'slot',
    aliases: ['slots'],
    description: 'Start the slotting machine and have good luck!',
    usage: '(amount)',
    cooldown: 13,
    id: 17,
    async execute(bot, message, args) {

        Coins.findOne({
            userID: message.author.id
        }, (err, coins) => {
            if (err) console.log(err);

            if (!coins) {
                message.channel.send('🚫 Ugh, you have no money.\nTry using the daily command or vote for me!');
            } else {
                let money;
                /**
                 * Money check
                 */
                if (coins.coins <= 0) return message.channel.send('🚫 Ugh, you have no money.\nTry using the daily command or vote for me!');
                if (args.length && ((isNaN(args[0]) == false) || args[0].toLowerCase() === 'all')) {
                    if (args[0].toLowerCase() === 'all') {
                        money = coins.coins;
                    } else {
                        if (coins.coins < Math.round(args[0])) {
                            return message.channel.send('🚫 You have not enough money.\nCheck your balance, claim dailies and vote.');
                        } else {
                            money = Math.round(args[0]);
                        }
                    }
                } else {
                    money = 1;
                }
                /**
                 * Slot
                 */
                let p = ['🍇', '🔔', '🍒', '🍉', '💎']; //prize
                let move = '<a:slots:594190009150472192>'; //moving slot
                let res = []; //array of p
                let won; //won amount
                let msg; //reply message
                let slot = Math.random() //random number
                if (slot < .515) {
                    msg = 'Won';
                } else {
                    msg = 'Lost'
                }
                if (slot <= .20) {
                    won = money;
                    res.push(p[0]);
                    res.push(p[0]);
                    res.push(p[0]);
                } else if (slot <= .40) {
                    won = money * 2;
                    res.push(p[1]);
                    res.push(p[1]);
                    res.push(p[1]);
                } else if (slot <= .45) {
                    won = money * 3;
                    res.push(p[2]);
                    res.push(p[2]);
                    res.push(p[2]);
                } else if (slot <= .475) {
                    won = money * 4;
                    res.push(p[3]);
                    res.push(p[3]);
                    res.push(p[3]);
                } else if (slot <= .485) {
                    won = money * 10;
                    res.push(p[4]);
                    res.push(p[4]);
                    res.push(p[4]);
                } else {
                    won = 0;
                    let slot1 = Math.floor(Math.random() * (p.length - 1));
                    let slot2 = Math.floor(Math.random() * (p.length - 1));
                    let slot3 = Math.floor(Math.random() * (p.length - 1));
                    if (slot3 == slot1)
                        slot2 = (slot1 + Math.ceil(Math.random() * (p.length - 2))) % (p.length - 1);
                    if (slot2 == p.length - 2)
                        slot2++;
                    res.push(p[slot1]);
                    res.push(p[slot2]);
                    res.push(p[slot3]);
                }
                let wonmsg = (won <= 0) ? 'won **nothing!**' : 'won **' + cm(won) + '** 💰!';
                /**
                 * Money saving
                 */
                let wonSave = won - money;
                coins.coins = coins.coins + wonSave;
                coins.save().catch(err => console.log(err));
                /**
                 * Message
                 */
                message.channel.send(' **> SLOTS** \n ' + move + move + move + ' \n`|         |`').then(m => setTimeout(function () {
                    m.edit(' **> SLOTS** \n' + res[0] + move + move + '\n`|         |`').then(m => setTimeout(function () {
                        m.edit(' **> SLOTS** \n' + res[0] + res[1] + move + '\n`|         |`').then(m => setTimeout(function () {
                            m.edit(' **> SLOTS** \n' + res[0] + res[1] + res[2] + '\n`|  ' + msg + '  |`\n\n**' + message.author.username + '** bet **' + cm(money) + '** 💰 and ' + wonmsg);
                        }, 800))
                    }, 800))
                }, 800))
            }
        })
    },
};