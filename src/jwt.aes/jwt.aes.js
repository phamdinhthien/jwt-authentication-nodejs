// Import thư viện và khởi tạo secretKey
const jwt = require('jsonwebtoken');
const secretKey = 'mysupersecretkey';

// Hàm tạo JWT
const genToken = (userInfo) => {
    const accessToken = jwt.sign({ userid: userInfo._id, email: userInfo.email }, secretKey, { expiresIn: '1h' });
    return accessToken;
}

// Hàm xác thực JWT
const validateToken = async(accessToken) => {
    jwt.verify(accessToken, secretKey, (err, decode) => {
        if(err) {
            console.error('error verify token');
        } else{
            console.log('decode jwt::', decode);
        }
    });
}

// Thực thi
async function runScript() {
    const userId = 1;
    const accessToken = genToken({_id: userId, email: 'pdthien@gmail.com'});
    await validateToken(accessToken);
}

runScript();