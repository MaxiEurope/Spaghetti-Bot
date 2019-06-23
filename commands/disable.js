require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://maxi:' + process.env.MONGO_PASS + '@cluster0-bk46m.mongodb.net/test', {
    useNewUrlParser: true
});
const Channel = require('../util/mongo/channel.js');

module.exports = {
    name: 'disable',
    description: 'Disable a specific command for a channel.',
    usage: '(command-name/all)',
    cooldown: 5,
    async execute(bot, message, args) {

        const {
            commands
        } = message.client;

        Channel.findOne({
            channelID: message.channel.id
        }, (err, cchannel) => {
            if (err) console.log(err);
            if (!cchannel) {
                let ncchannel = new Channel({
                    channelID: message.channel.id,
                    c1: false,
                    c2: false,
                    c3: false,
                    c4: false,
                    c5: false,
                    c6: false,
                    c7: false,
                    c8: false,
                    c9: false,
                    c10: false,
                    c11: false,
                    c12: false,
                    c13: false,
                    c14: false,
                    c15: false,
                    c16: false,
                    c17: false,
                    c18: false,
                    c19: false,
                    c20: false
                })
                ncchannel.save().catch(err => console.log(err));
                return message.channel.send('🚫 You have no commands disabled in this channel. You can disable them by using `-disable <command>` or `-disable all`.');
            } else {
                if (!args.length) {
                    return message.channel.send('🖇 Disabled commands in this channel.\n' + '`' + listCommands(cchannel, commands) + '`');
                } else {
                    if (args[0] === 'all') {
                        disableAll(cchannel, message);
                    } else {
                        const name = args[0].toLowerCase();
                        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
                        if (!command) return message.channel.send('🚫 **' + name + '** is not a valid command! List disable commands by using `-disable`.');
                        const commandID = command.id;
                        //i hate this - will change that... warum kommentiere ich das jz auf englisch tf
                        if (commandID == 1) cchannel.c1 = true;
                        else if (commandID == 2) cchannel.c2 = true;
                        else if (commandID == 3) cchannel.c3 = true;
                        else if (commandID == 4) cchannel.c4 = true;
                        else if (commandID == 5) cchannel.c5 = true;
                        else if (commandID == 6) cchannel.c6 = true;
                        else if (commandID == 7) cchannel.c7 = true;
                        else if (commandID == 8) cchannel.c8 = true;
                        else if (commandID == 9) cchannel.c9 = true;
                        else if (commandID == 10) cchannel.c10 = true;
                        else if (commandID == 11) cchannel.c11 = true;
                        else if (commandID == 12) cchannel.c12 = true;
                        else if (commandID == 13) cchannel.c13 = true;
                        else if (commandID == 14) cchannel.c14 = true;
                        else if (commandID == 15) cchannel.c15 = true;
                        else if (commandID == 16) cchannel.c15 = true;
                        else if (commandID == 17) cchannel.c15 = true;
                        else if (commandID == 18) cchannel.c15 = true;
                        else if (commandID == 19) cchannel.c15 = true;
                        else if (commandID == 20) cchannel.c15 = true;
                        //ende - phew
                        cchannel.save().catch(err => console.log(err));
                        message.channel.send('🖇 Successfully disabled command **' + command.name + '**.');
                    }
                }
            }
        })
    },
};

function listCommands(cchannel, commands) {
    let res = [];
    //einfach unten ignorieren
    if (cchannel.c1 == true) res.push(commands.find(m => m.id == 1).name);
    if (cchannel.c2 == true) res.push(commands.find(m => m.id == 2).name);
    if (cchannel.c3 == true) res.push(commands.find(m => m.id == 3).name);
    if (cchannel.c4 == true) res.push(commands.find(m => m.id == 4).name);
    if (cchannel.c5 == true) res.push(commands.find(m => m.id == 5).name);
    if (cchannel.c6 == true) res.push(commands.find(m => m.id == 6).name);
    if (cchannel.c7 == true) res.push(commands.find(m => m.id == 7).name);
    if (cchannel.c8 == true) res.push(commands.find(m => m.id == 8).name);
    if (cchannel.c9 == true) res.push(commands.find(m => m.id == 9).name);
    if (cchannel.c10 == true) res.push(commands.find(m => m.id == 10).name);
    if (cchannel.c11 == true) res.push(commands.find(m => m.id == 11).name);
    if (cchannel.c12 == true) res.push(commands.find(m => m.id == 12).name);
    if (cchannel.c13 == true) res.push(commands.find(m => m.id == 13).name);
    if (cchannel.c14 == true) res.push(commands.find(m => m.id == 14).name);
    if (cchannel.c15 == true) res.push(commands.find(m => m.id == 15).name);
    if (cchannel.c16 == true) res.push(commands.find(m => m.id == 16).name);
    if (cchannel.c17 == true) res.push(commands.find(m => m.id == 17).name);
    if (cchannel.c18 == true) res.push(commands.find(m => m.id == 18).name);
    if (cchannel.c19 == true) res.push(commands.find(m => m.id == 19).name);
    if (cchannel.c20 == true) res.push(commands.find(m => m.id == 20).name);
    //ich habe wirklich keine ahnung wie ich das verbessern könnte
    if (res.length == 0) {
        res = 'none';
    } else {
        res.join(', ');
    }
    return res;
}

function disableAll(cchannel, message) {
    cchannel.c1 = true,
        cchannel.c2 = true,
        cchannel.c3 = true,
        cchannel.c4 = true,
        cchannel.c5 = true,
        cchannel.c6 = true,
        cchannel.c7 = true,
        cchannel.c8 = true,
        cchannel.c9 = true,
        cchannel.c10 = true,
        cchannel.c11 = true,
        cchannel.c12 = true,
        cchannel.c13 = true,
        cchannel.c14 = true,
        cchannel.c15 = true,
        cchannel.c16 = true,
        cchannel.c17 = true,
        cchannel.c18 = true,
        cchannel.c19 = true,
        cchannel.c20 = true
    cchannel.save().catch(err => console.log(err));
    return message.channel.send('🖇 Successfully disabled **all** commands in this channel!');
}