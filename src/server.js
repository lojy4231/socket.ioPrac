const dotenv = require('dotenv');
dotenv.config()

const http = require('./app');


if(process.env.NODE_ENV !== 'test'){
    http.listen(process.env.PORT, () => {
        console.log('서버가 요청을 받을 준비가 됐어요');
    });
}

