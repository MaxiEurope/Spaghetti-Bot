module.exports = {
    name: 'eval',
    description: 'Evaluate some code.',
    usage: 'sp!eval <code>',
    cooldown: 1,
    async execute(bot, message) {

        if (message.author.id !== '393096318123245578') return;

        try {
            const com = eval(message.content.split(' ').slice(1).join(' '));
            message.channel.send('```\n' + com + '```');
        } catch (e) {
            message.channel.send('```javascript\n' + e + '```');
        }
    }
};