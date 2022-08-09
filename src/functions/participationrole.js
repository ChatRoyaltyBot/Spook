const ParticipationRole = require('../_database/models/participationRoleSchema')

async function checkAutoRoles(client, message) {
    let pr = await ParticipationRole.findOne({
        guildID: message.guild.id,
        channelID: message.channel.id
    })
    const member = message.member

    if (!!pr) {
        if (!member.roles.cache.has(pr.roleID)) {
            member.roles.add(pr.roleID)
            const role = message.guild.roles.cache.get(pr.roleID)
            const roleName = role.name || pr.roleID
            let msg = `Congratulations <@${member.id}> :tada:, you have received the following role: ${roleName}`
            await message.channel.send(msg)
        }
    }
}

module.exports = {
    name: "participationrole",
    checkAutoRoles,
}