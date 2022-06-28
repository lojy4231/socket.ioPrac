const { Schema, model } = require("mongoose")
// https://mongoosejs.com/docs/validation.html

//https://runebook.dev/ko/docs/mongoose/schematypes
const userschema = new Schema({
    nickname: {
        type: String,
        required: [true, '닉네임을 입력하세요'],
        unique: true,
        trim: true,
        match: [/^(?=.*[a-z0-9가-힣A-Z])[a-z0-9가-힣]{3,18}$/, '닉네임은 영문,숫자,한글로 된 3~18자입니다.']
    },
    password: {
        type: String,
        required: true,
        // enum: { values: [this.checkPassword], message: '비밀번호가 일치하지 않습니다.' }
    }
},
{
  timestamps: true
});

const Users = model('user', userschema);
module.exports = { Users, userschema }