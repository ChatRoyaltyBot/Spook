const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice')
const { getGuildSettings } = require("../../functions/functions")
const fs = require("fs")
const path = require( "path" );
module.exports = {
    name: "play",
    category: "audio",
    description: 'play sound',
    usage: '<channel>',
    run: async ({ client, message, args }) => {

        const settings = await getGuildSettings(message.guild.id)
        if (!!settings.shopResetChannelID) {
            message.reply("No Voice Channel set up. Use settings to initialize it.")
            return
        }

        let player = client.audioPlayers.get(message.guild.id)

        if (!player || player === undefined) {
            player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            client.audioPlayers.set(message.guild.id, player)

            const connection = joinVoiceChannel({
                channelId: settings.voiceChannelID,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            let files = fs.readdirSync('./audio/');
            const file = path.resolve( './audio/', files[Math.floor(Math.random() * files.length)] );

            const resource = createAudioResource(file);
            player.play(resource);
            connection.subscribe(player);        

        } else {
            message.reply('Player already exists')
        }
    }
}