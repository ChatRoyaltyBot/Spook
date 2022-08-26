const { addLog } = require('../../functions/logs');
const mongoose = require('mongoose')
const BannedWord = require('../../_database/models/bannedWordSchema')

module.exports = {
    name: "addbannedword",
    aliases: ["abw"],
    category: "bannedwords",
    cmdpermissions: 10,
    description: 'Add a banned word',
    usage: "<word>",
    run: async ({ client, message, args }) => {
        let bannedWord = args[0]

        if (!bannedWord) return await message.reply("No banned word supplied")
        bannedWord = bannedWord.toLowerCase()

        let bw = await BannedWord.findOne({
            guildID: message.guild.id,
            bannedWord: bannedWord
        })

        if (bw) return await message.reply(`Banned word \`${bannedWord}\` already added.`)

        bw = await new BannedWord({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            bannedWord: bannedWord
        })

        try {
            await bw.save()
            await message.reply(`\`${bannedWord}\` added as a banned word.`)
        } catch (error) {
            addLog(error, error.stack)
        }
    }
}