require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Profile = require('../util/mongo/profile.js');
const Discord = require('discord.js');
const lettercount = require('letter-count');
const commanumber = require('comma-number');

module.exports = {
    name: 'profile',
    description: 'Your beautiful profile. Earn xp, level up, change your description and show your stats.',
    usage: '(setting)',
    cooldown: 5,
    id: 15,
    async execute(bot, message, args) {

        let _user = message.mentions.users.first() || message.author;
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
                        color: '#00ff00'
                    })
                    newProfile.save().catch(err => console.log(err));
                    return message.channel.send('✅ Successfully created profile for you.');
                }else{
                    return message.channel.send('🚫 This user has never created its profile. Tell them to do so.');
                }
            }else{
                if(!args.length){
                    let _profile = new Discord.RichEmbed()
                        .setTitle(_user + '\'s profile')
                        .setThumbnail(_user.displayAvatarURL)
                        .setColor(profile.color)
                        .setTimestamp(profile.creationDate)
                        .setDescription('**INFO:** - '+profile.shortDesc+'\n\n'+
                        '**Description:** - '+profile.longDesc+'')
                        .addField('Level', `**${profile.lvl}**`, true)
                        .addField('XP', `**${commanumber(profile.xp)}/${commanumber(((5 * (Math.pow(profile.lvl, 2))) + (50 * profile.lvl) + 100))}`)
                        .setFooter('Edit: -profile settings | Profile created at');
                    message.channel.send(_profile);
                }
            }
        })
    },
};