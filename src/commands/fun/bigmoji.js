module.exports = {
    name: "bigmoji",
    aliases: ["bm"],
    category: "fun",
    description: 'Show emoji big',
    usage: "<emoji>",
    run: async ({ client, message, args }) => {

        let emojiInfo = args[0].replace('<', '').replace('>', '').split(':')

        let ext = "webp"
        if (emojiInfo[0] === "a")
            ext = "gif"

        if (emojiInfo[2] === undefined) {
            message.reply('No emoji found to enlarge. Could either be a default emoji or non specified')
        } else
            message.channel.send(`https://cdn.discordapp.com/emojis/${emojiInfo[2]}.${ext}?quality=lossless&size=96`)
        //message.reply()
    }
}