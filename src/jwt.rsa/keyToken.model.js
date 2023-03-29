// keytoken.model.js
// Tạo bảng (collection) lưu trữ Public key
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

var keyTokenSchema = new Schema({
    userid: {
        type: Number,
        required: true
    },
    publicKey: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
