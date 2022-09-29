const Discord = require("discord.js")
const ParticipationRole = require('../../_database/models/participationRoleSchema')

module.exports = {
    name: "listparticipationrole",
    aliases: ["lpr"],
    category: "participationrole",
    cmdpermissions: 20,
    description: 'Lists all channel Participation roles',
    usage: "[channelID]",
    run: async ({ client, message, args }) => {
        let channelID = args[0]

        let pr
        if (!channelID) {
            pr = await ParticipationRole.find({
                guildID: message.guild.id
            })
        } else {
            pr = await ParticipationRole.find({
                guildID: message.guild.id,
                channelID: channelID
            })
        }

        let printData = []

        await pr.forEach(async entry => {
            const channel = message.guild.channels.cache.get(entry.channelID)
            const channelName = channel.name || entry.channelID
            const role = message.guild.roles.cache.get(entry.roleID)
            const roleName = role.name || entry.roleID
            printData.push([`#${channelName}`, `@${roleName}`])
        })

        if (printData.length === 0) {
            return await message.reply('No channel participation roles set up on server.')
        }

        let embed = new Discord.EmbedBuilder()
            .setColor("#8DC685")
            .setTitle("Channel Participation Roles")
            .setDescription(client.functions.get("functions").autoAlign(printData))

        embed = client.functions.get("functions").setEmbedFooter(embed, client)

        await message.reply({ embeds: [embed] })
    }
}