const { addLog } = require('../../functions/logs');
const BannedWord = require('../../_database/models/bannedWordSchema')

module.exports = {
    name: "removebannedword",
    aliases: ["rbw"],
    category: "bannedwords",
    cmdpermissions: 10,
    description: 'Removes a banned word',
    usage: "<word>",
    run: async ({ client, message, args }) => {
        let bannedWord = args[0]

        if (!bannedWord) return await message.reply("No banned word supplied")
        bannedWord = bannedWord.toLowerCase()

        let bw = await BannedWord.findOne({
            guildID: message.guild.id,
            bannedWord: bannedWord
        })

        if (!bw) {
            return await message.reply(`Banned word \`${bannedWord}\` not set up.`)
        }

        try {
            await bw.delete()
            await message.reply(`\`${bannedWord}\` removed from banned words.`)
        } catch (error) {
            addLog(error, error.stack)
        }        
    }
}