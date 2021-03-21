const {
    inspect
} = require('util');

module.exports = {
    name: 'eval',
    description: 'Evaluate some code.',
    usage: 'sp!eval <code>',
    cooldown: 1,
    async execute(bot, message, args) {

        if (message.author.id !== '393096318123245578') return;

        let input = args.join(' ');
        const asynchr = input.includes('return') || input.includes('await');

        let result, evalTime;

        try {
            const before = Date.now();
            result = await eval(asynchr ? `(async()=>{${input}})();` : input);
            evalTime = Date.now() - before;
            if (typeof result !== 'string') {
                result = inspect(result, {
                    depth: Number(!(inspect(result, {
                        depth: 1
                    }).length > 2030))
                });
            }
            result = result.replace(new RegExp(`${bot.token}|${process.env.TOPGG_TOKEN}|${process.env.BFD_TOKEN}`, 'gi'), 'nice try');
        } catch (err) {
            result = err.message;
        }

        if (result.length > 2030) {
            const buffer = Buffer.from(`INPUT BELOW\n${input}\n\nOUTPUT BELOW\n${result}`, 'utf8');
            const res = new this.Discord.MessageAttachment(buffer, 'eval.txt');
            return message.channel.send('Result exceeds 2k chars', {
                files: [res]
            }).catch(() => {});
        }
        
        return message.channel.send({
            embed: {
                color: 'cc2507',
                description: `\`\`\`js\n${result}\`\`\``,
                footer: {
                    text: `${evalTime || evalTime === 0 ? `evaluated in ${evalTime}ms` : ''}`
                }
            }
        }).catch(() => {});
    }
};