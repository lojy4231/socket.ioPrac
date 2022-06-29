const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const chatSchema = new Schema({
    chat: {
        type: String,
        required: true,
    },
},
{
  timestamps: true
});

const Chat = model('chat', chatSchema);
module.exports = { Chat, chatSchema }