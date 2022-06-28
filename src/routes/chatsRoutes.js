const express = require("express");
const chatsRouter = express.Router();

const { Users, Chat } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

//채팅 조회
chatsRouter.get('/chats', async (req, res) => {
    try {
        const date = new Date(Date.now() - 60 * 60 * 1000);
        console.log(date);
        const chatList = { timestamps: { $gt: date } };
        const chat = await Chat.find(chatList);

        res.status(200).json({ success: true, message: "메세지를 불러왔습니다.", chat });
    
    } catch (error) {
        return res.status(500).send({ errorMeesage: error.message });
    }
});


// 채팅 생성
chatsRouter.post('/chats', authMiddleware, async (req, res) => {
    try{
        const { user } = res.locals;
        const { chat } = req.body;
        const checkUser = await Users.findOne({ nickname: user.nickname });

        if(!checkUser) { return res.status(400).json({ success: false, errorMessage: "로그인 후 사용하세요" }) };
        if(!chat){ return res.status(400).json({ success: false, errorMessage: "메세지를 입력하세요 사용하세요" }) };

        const createCaht = await Chat.create({ nickname: user.nickname, chat:{ text: chat} });
        
        res.status(200).json({ success: true, message: "메세지 전달완료", createCaht });

    } catch (error) {
        return res.status(500).json({ success:false, errorMessage: error.message });
    };
});


module.exports = {chatsRouter};