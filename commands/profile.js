require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Profile = require('../util/mongo/profile.js');
const Discord = require('discord.js');
const lettercount = require('letter-count');
const commanumber = require('comma-number');
const parse = require('parse-color');

module.exports = {
    name: 'profile',
    description: 'Your beautiful profile. Earn xp, level up, change your description and show your stats. Run the command once, and your profile is being created. View/change your settings by running `-profile settings`. You can also mention a user to see its profile. You can get 15 - 25 xp once a minute.',
    usage: '(settings)',
    cooldown: 5,
    id: 15,
    async execute(bot, message, args) {

        let _user = message.mentions.users.first() || message.author;
        if(_user.bot === true) return message.channel.send('🚫 Bots do not get xp.');
        Profile.findOne({
            userID: _user.id
        }, (err, profile) => {
            if (err) console.log(err);
            if (!profile) {
                if (message.author.id === _user.id) {
                    let newProfile = new Profile({
                        userID: message.author.id,
                        xp: 0,
                        lvl: 0,
                        creationDate: Date.now(),
                        shortDesc: 'A very cool person.',
                        longDesc: 'none',
                        color: '#00ff00',
                        lvlupMessage: false
                    })
                    newProfile.save().catch(err => console.log(err));
                    return message.channel.send('✅ Successfully created profile for you.');
                } else {
                    return message.channel.send('🚫 This user has never created its profile. Tell them to do so.');
                }
            } else {
                if (args.length && args[0].toLowerCase() === 'settings') {
                    if (_user.id !== message.author.id) return message.channel.send('🚫 You cannot edit/view others profile settings!');

                    if (args[1] && args[1].toLowerCase() === 'info') {
                        let text = args.slice(2).join(' ');
                        if (!text) return message.channel.send('🚫 That\'s not a valid info.');
                        let count = lettercount.count(text).chars;
                        if (count > 50) return message.channel.send('🚫 That info is way too long. **50** chars are the max.');
                        profile.shortDesc = text;
                        profile.save().catch(err => console.log(err));
                        return message.reply('✅ Saved your info.');
                    } else if (args[1] && args[1].toLowerCase() === 'description') {
                        let text = args.slice(2).join(' ');
                        if (!text) return message.channel.send('🚫 That\'s not a valid description.');
                        let count = lettercount.count(text).chars;
                        if (count > 750) return message.channel.send('🚫 That description is way too long. **750** chars are the max.');
                        profile.longDesc = text;
                        profile.save().catch(err => console.log(err));
                        return message.reply('✅ Saved your description.');
                    } else if (args[1] && args[1].toLowerCase() === 'color') {
                        let color = args[2];
                        if (!color) return message.channel.send('🚫 You didn\'t specify a color. Use `#0ffff0` or a css color for example.');
                        if (!color.startsWith('#') && color.length === 6) {
                            const testResult = parse(`#${color}`);
                            if (!testResult.hex) {
                                return message.channel.send('🚫 Thats not a valid color. Use `#0ffff0` or a css color for example.');;
                            }
                            color = testResult;
                        } else {
                            color = parse(color);
                        }
                        if (!color.cmyk || !color.rgb || !color.hsv || !color.hsl || !color.hex) {
                            return message.channel.send('🚫 This color seems invalid. Use a hex color instead or search for css colors.');;
                        }
                        profile.color = color.hex;
                        profile.save().catch(err => console.log(err));
                        return message.reply('✅ Saved your color.');
                    } else if (args[1] && args[1].toLowerCase() === 'message') {
                        let trueFalse = args[2];
                        let res;
                        if (!trueFalse) return message.channel.send('🚫 Please decide whether I shall send level-up messages in the chat. `true/false`');
                        if (trueFalse.toLowerCase() === 'true') res = true;
                        else if (trueFalse.toLowerCase() === 'false') res = false;
                        else return message.channel.send('🚫 Please decide whether I shall send level-up messages in the chat. `true/false`');
                        profile.lvlupMessage = res;
                        profile.save().catch(err => console.log(err));
                        return message.reply('✅ Saved.');
                    } else {
                        message.channel.send(`**${message.author.username}'s** current profile settings:\n` +
                            `**Info:** - change with \`-profile settings info <text>\`\n\`\`\`${profile.shortDesc}\`\`\`\n` +
                            `**Description:** - change with \`-profile settings description <text>\`\n\`\`\`${profile.longDesc}\`\`\`\n` +
                            `**Color:** - change with \`-profile settings color <hex/css color>\` - ${profile.color}\n` +
                            `**Lvl-up-msgs:** - change with \`-profile settings message <true/false> - \`${profile.lvlupMessage}`);
                    }
                } else {
                    let _profile = new Discord.RichEmbed()
                        .setTitle(_user.username + '\'s profile')
                        .setThumbnail(_user.displayAvatarURL)
                        .setColor(profile.color)
                        .setTimestamp(profile.creationDate)
                        .setDescription('**INFO:** - ' + profile.shortDesc + '\n\n' +
                            '**Description:** - ' + profile.longDesc + '')
                        .addField('Level', `**${profile.lvl}**`, true)
                        .addField('XP', `**${commanumber(profile.xp)}/${commanumber(((5 * (Math.pow(profile.lvl, 2))) + (50 * profile.lvl) + 100))}**`, true)
                        .setFooter('Edit: -profile settings | Profile created');
                    message.channel.send(_profile);
                }
            }
        })
    },
};