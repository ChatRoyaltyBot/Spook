const { joinVoiceChannel } = require('@discordjs/voice');
const { getGuildSettings } = require("../../functions/functions")

module.exports = {
    name: "stop",
    category: "audio",
    description: 'stop playing sound',
    run: async ({ client, message, args }) => {
        let player = client.audioPlayers.get(message.guild.id)

        const settings = await getGuildSettings(message.guild.id)
        if (!!settings.shopResetChannelID) {
            message.reply("No Voice Channel set up. Use settings to initialize it.")
            return
        }

        if (!player || player === undefined) {
            message.reply('not playing')
        } else {
            try {
                player.stop();
            } catch (error) {
                
            }
            client.audioPlayers.set(message.guild.id, null)
            const connection = joinVoiceChannel({
                channelId: settings.voiceChannelID,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            connection.destroy()            
        }        
    }
}