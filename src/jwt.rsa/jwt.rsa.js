// Import thư viện và các biến
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('./init.mongodb');
const keytokenModel = require("./keytoken.model.js");

// Hàm xử lý lưu public key vào DB
const createKeyToken = async({userid, publicKey}) => {
    const publicKeyString = publicKey.toString();
    const filter = {userid: userid};
    const update = {userid: userid, publicKey: publicKeyString};
    const options = {upsert: true, new: true};
    await keytokenModel.findOneAndUpdate(filter, update, options);
}

// Hàm tạo JWT từ private key
const createAccessToken = async (payload, privateKey) => {
    const accessToken = await jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });
    return accessToken;
}

// Hàm genToken. Xử lý 2 việc: Lưu public key vào DB + Dùng private key để mã hóa tạo JWT.
const genToken = async(userInfo) => {
    // Dùng rsa để tạo privateKey và publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding:  { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    })
    // Lưu userid và publicKey vào bảng KeyToken
    await createKeyToken({ userid: userInfo._id, publicKey })
    // Tạo accessToken với privateKey
    const accessToken = await createAccessToken({ userid: userInfo._id, email: userInfo.email }, privateKey);
    return accessToken;
}

// Hàm lấy publicKey
const getPublicKey = async(userid) => {
    const filter = {userid: userid};
    const token = await keytokenModel.findOne(filter);
    return token.publicKey;
}

// Hàm validateToken. Xử lý 2 việc: Lấy publicKey từ DB + Xác thực (verify) token từ publicKey
const validateToken = async(accessToken, userID) => {
    // Lấy publicKey trong DB
    const publicKeyString = await getPublicKey(userID);
    // Convert publicKey từ dạng string về dạng rsa có thể đọc được
    const publicKeyObject = crypto.createPublicKey(publicKeyString);
    // xác thực accessToken sử dụng publicKey
    jwt.verify(accessToken, publicKeyObject, (err, decode) => {
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
    let accessToken = await genToken({_id: userId, email: 'pdthien@gmail.com'});
    await validateToken(accessToken, userId);
};

runScript();