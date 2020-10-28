/** modules */
const momentTimezone = require('moment-timezone');
const Coins = require('./mongo/coins.js');
const Channel = require('./mongo/channel.js');
const Feed = require('./mongo/feed.js');
const Prefix = require('./mongo/prefix.js');

exports.log = (msg) => {
    const time = momentTimezone(Date.now()).tz('Europe/Vienna').format('MMM Do YYYY HH:mm:ss');
    console.log(`${time} | ${msg}`);
};

exports.comma = (arg) => {
    return arg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

exports.count = (arg) => {
    return arg.replace(/\s/g, '').length;
};

exports.isID = (arg) => {
    if (arg.match(/^[0-9]+$/)) return arg;
    return false;
};

exports.isNum = (arg) => {
    return !isNaN(arg) && parseInt(Number(arg)) == arg && !isNaN(parseInt(arg, 10));
};

exports.shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

exports.getUser = async (bot, arg) => {
    if (!arg) {
        return;
    } else {
        if (arg.match(/<@!?([0-9]*)>/)) {
            arg = arg.match(/<@!?([0-9]*)>/)[1];
        }
        try {
            const user = await bot.users.fetch(arg, true);
            return user;
        } catch (e) {
            return;
        }
    }
};

exports.maxMinus = (x) => {
    return ((5 * (Math.pow(x - 1, 2))) + (50 * (x - 1)) + 100);
};

exports.totXP = (lvl, xp) => {
    let res = xp;
    for (let i = 0; i < lvl; i++) {
        res += this.maxMinus(i);
    }
    return res;
};

/** db methods */
exports.addCoins = async (ID, amount) => {
    const res = await Coins.findOne({
        userID: ID
    });
    if (res === null) {
        await new Coins({
            userID: ID,
            coins: amount + 3000
        }).save().catch(() => {});
        return amount + 3000;
    } else {
        await Coins.findOneAndUpdate({
            userID: ID
        }, {
            coins: res.coins + amount
        });
        return res.coins + amount;
    }
};

exports.addFeed = async (ID, amount) => {
    const res = await Feed.findOne({
        userID: ID
    });
    if (res === null) {
        await new Feed({
            userID: ID,
            total: amount
        }).save().catch(() => {});
        return amount;
    } else {
        await Feed.findOneAndUpdate({
            userID: ID
        }, {
            total: res.total + amount
        });
        return res.total + amount;
    }
};

exports.getPrefix = (ID) => {
    return new Promise((resolve) => {
        Prefix.findOne({
            serverID: ID
        }, (err, res) => {
            if (err) return this.log(err);
            if (!res) {
                resolve(false);
            } else {
                resolve(res.prefix);
            }
        });
    });
};

exports.isDisabled = (ID, cmd) => {
    return new Promise((resolve) => {
        Channel.findOne({
            channelID: ID
        }, (err, res) => {
            if (err) return this.log(err);
            if (res) {
                if (res.disabled.includes(cmd)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
};