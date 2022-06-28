const dotenv = require('dotenv');
dotenv.config();


const express = require("express")
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTACCESSKEY;
const usersRouter = express.Router();
const { Users } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

usersRouter.post('/register', async (req, res) => {
    try {
        const { nickname, password, checkpassword } = req.body;
        const checkUser = await Users.findOne().or([{ nickname }]);
        const regExpPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$/;

        if (password !== checkpassword) return res.status(400).json({ success: false, errorMessage: "비밀번호가 비밀번호 확인란과 동일하지 않습니다." });

        if (checkUser) return res.status(400).json({ success: false, errorMessage: "이미 존재하는 아이디 또는 닉네임입니다." });

        if (!regExpPassword.test(password)) return res.status(400).send({ success: false, errorMessage: "비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용 가능 4-20자", });

        if (password.match(nickname)) return res.status(400).send({ success: false, errorMessage: "비밀번호에 닉네임을 포함할 수 없습니다.", });


        const user = new Users({ nickname, password });
        await user.save();

        return res.status(200).json({ success: true, message: "회원가입 했습니다.", user });

    } catch (error) {
        return res.status(400).json({ success: false, errorMessage: error.message });
    }
});

usersRouter.post('/auth', async (req, res) => {
    try {
        const { nickname, password } = req.body;
        
        const checkUser = await Users.findOne({ nickname });

        if(!(nickname && password)) return res.status(400).json({success: false, errorMessage: "닉네임 또는 비밀번호를 입력하세요."});

        if(!(checkUser && password)) return res.status(400).json(({success: false, errorMessage: "닉네임 또는 비밀번호가 틀렸습니다."}));
        
        const token = jwt.sign({ nickname }, jwtSecret)
        
        res.status(200).json({ message: "로그인 되었습니다.", token});
    } catch (error) {
        return res.status(400).json({ success: false, errorMessage: error.message });
    }
});

// 로컬 변수 데이터 들어오는 지 확인
usersRouter.get('/user', authMiddleware, async (req, res) => {
    try{
      const { localuser } = res.locals;
      res.status(200).json({
        succees:true,
        message: "로컬변수를 불러왔습니다.",
        localuser,
      });
      
    }catch(error){
      res.status(400).json({errorMessage: error.message});
    }

});

module.exports = {usersRouter};