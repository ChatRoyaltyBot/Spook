const mongoose = require("mongoose")

const bannedWordSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    bannedWord: String
})

module.exports = new mongoose.model('BannedWord', bannedWordSchema, 'bannedWords')