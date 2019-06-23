exports.handler = (dbl, bot, vote) => {
    bot.users.get('393096318123245578').send('New Vote! ' + bot.users.get(vote.user).username + ' **|** ' + vote.user);
    const Coins = require('./mongo/coins.js');
    let _week = '',
        multi = 1;
    dbl.isWeekend().then(async weekend => {
        if (weekend) {
            _week = '\nIt\'s the weekend! Your money got doubled!',
                multi = 2;
        }
        let randomCoins = Math.round(Math.random() * (50 - 40 + 1) + 40);
        Coins.findOne({
            userID: vote.user
        }, async (err, coins) => {
            if (err) console.log(err);
            if (!coins) {
                let ncoins = new Coins({
                    userID: vote.user,
                    coins: randomCoins * multi,
                    getIndex: 0
                })
                ncoins.save().catch(err => console.log(err));
            } else {
                coins.coins = coins.coins + (randomCoins * multi);
                coins.save().catch(err => console.log(err));
            }
            let toSend = bot.users.get(vote.user);
            try {
                await toSend.send('🍝 Thanks for voting! You got **' + (randomCoins * multi) + '** 💰!' + _week);
            } catch (e) {
                console.log('Vote User has blocked me.');
            }
        })
    })
}