const Discord = require("discord.js")
const BannedWord = require('../../_database/models/bannedWordSchema')

module.exports = {
    name: "listbannedwords",
    aliases: ["lbw"],
    category: "bannedwords",
    permissions: 20,
    description: 'Lists all banned words',
    run: async ({ client, message, args }) => {

        let bw = await BannedWord.find({
            guildID: message.guild.id
        })

        let printData = []

        await bw.forEach(async entry => {
            printData.push(entry.bannedWord)
        })

        if (printData.length === 0) {
            return await message.reply('No banned words set up on server.')
        }

        let embed = new Discord.MessageEmbed()
            .setColor("#8DC685")
            .setTitle("Banned words")
            .setDescription(printData.join("\n"))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}