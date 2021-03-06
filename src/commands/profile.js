const Profile = require('../util/mongo/profile.js');
const Discord = require('discord.js-light');
const parse = require('parse-color');
const util = require('../util/util.js');
const validSettings = ['info', 'description', 'color', 'lvlup'];

module.exports = {
    name: 'profile',
    aliases: ['level', 'lvl'],
    example: ['sp!profile @User', 'sp!profile settings color #000000', 'sp!profile settings info idk who I am', 'sp!profile settings lvlup true'],
    description: 'Your profile. Earn xp and level up by chatting & using commands.' +
        'View and change your profile settings using `sp!profile settings`.\nYou can also view an users profile by mentioning them.\n' +
        'You can earn a maximum of **25** xp once per minute.\n' +
        `Valid settings: \`${validSettings.join('` `')}\``,
    usage: 'sp!profile settings (setting) (value)',
    cooldown: 5,
    async execute(bot, message, args) {

        let user = message.author;

        if (args.length) {
            user = await util.getUser(bot, args[0]);
            if (!user) {
                if (args[0].toLowerCase() === 'settings') {
                    settings(message.author.id, args);
                } else {
                    viewProfile(message.author);
                }
            } else {
                viewProfile(user);
            }
        } else {
            viewProfile(message.author);
        }

        async function viewProfile(us) {
            const coins = await util.addCoins(us.id, 0);
            const cmds = await util.addCmd(us.id, 0);
            Profile.findOne({
                userID: us.id
            }, (err, p) => {
                if (err) return util.log(err);
                if (!p) {
                    message.reply(`⛔ Profile for user **${us.tag}** not found!`).catch(() => {});
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`${us.username}'s profile`, us.displayAvatarURL({
                            dynamic: true
                        }))
                        .setDescription(`${p.shortDesc} `)
                        .addField('Level 🆙', `\`${p.lvl}\``, true)
                        .addField(`Exp ${bot.xp}`, `\`${util.comma(p.xp)} / ${util.comma(((5 * (Math.pow(p.lvl, 2))) + (50 * p.lvl) + 100))}\` `, true)
                        .addField(`Coins ${bot.coin}`, `**${util.comma(coins)}**`, true)
                        .addField('Commands ran', `**${util.comma(cmds)}**`, true)
                        .addField('Info box', p.longDesc, false)
                        .setColor(p.color)
                        .setTimestamp(p.creationDate)
                        .setFooter('Profile created at');
                    message.reply(embed).catch(() => {});
                }
            });
        }

        async function viewSetting(us) {
            const userSetting = await Profile.findOne({
                userID: us.id
            });
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${us.tag}'s profile settings`)
                .addField('Info', `\`\`\`${userSetting.shortDesc}\`\`\``, false)
                .addField('Description', `\`\`\`${userSetting.longDesc}\`\`\``, false)
                .addField('Send msg on lvlup', `\`\`\`diff\n${(userSetting.lvlupMessage === true)?'+ true': '-false'}\`\`\``, false)
                .addField('Color', `\`\`\`${userSetting.color}\`\`\``)
                .setColor(userSetting.color);
            message.reply(embed).catch(() => {});
        }

        async function settings(ID, args) {
            if (args.length >= 3 && validSettings.some(e => args[1].toLowerCase() === e)) {
                const setting = args[1].toLowerCase();
                if (setting === validSettings[0]) {
                    const info = args.slice(2).join(' ');
                    if (!info) return message.reply('⛔ You must provide some text!\nℹ Usage: `sp!profile settings info someone`').catch(() => {});
                    if (util.count(info) > 50) return message.reply('⛔ Character limit of `50` exceeded.').catch(() => {});
                    await Profile.findOneAndUpdate({
                        userID: ID
                    }, {
                        shortDesc: info
                    });
                    message.reply('✅ Updated your profile.').catch(() => {});
                } else if (setting === validSettings[1]) {
                    const description = args.slice(2).join(' ');
                    if (!description) return message.reply('⛔ You must provide some text!\nℹ Usage: `sp!profile settings description spaghetti bot user`').catch(() => {});
                    if (util.count(description) > 750) return message.reply('⛔ Character limit of `750` exceeded.').catch(() => {});
                    await Profile.findOneAndUpdate({
                        userID: ID
                    }, {
                        longDesc: description
                    });
                    message.reply('✅ Updated your profile.').catch(() => {});
                } else if (setting === validSettings[2]) {
                    const color = args[2].toLowerCase();
                    if (!color) return message.reply('⛔ You must provide a valid **hex** color!\nℹ Usage: `sp!profile settings color #000000`').catch(() => {});
                    if (!parse(color).hex) return message.reply('⛔ You must provide a valid **hex** color!\nℹ Usage: `sp!profile settings color #000000`').catch(() => {});
                    await Profile.findOneAndUpdate({
                        userID: ID
                    }, {
                        color: parse(color).hex
                    });
                    message.reply('✅ Updated your profile.').catch(() => {});
                } else if (setting === validSettings[3]) {
                    const lvlupMessage = args[2].toLowerCase();
                    if (!lvlupMessage) return message.reply('⛔ You must provide **true** or **false**!\nℹ Usage: `sp!profile settings lvlup true`').catch(() => {});
                    if (!['true', 'false'].some(e => lvlupMessage === e)) return message.reply('⛔ You must provide **true** or **false**!\nℹ Usage: `sp!profile settings lvlup true`').catch(() => {});
                    await Profile.findOneAndUpdate({
                        userID: ID
                    }, {
                        lvlupMessage: (lvlupMessage === 'true')
                    });
                    message.reply('✅ Updated your profile.').catch(() => {});
                }
            } else {
                viewSetting(message.author);
            }
        }

    },
};