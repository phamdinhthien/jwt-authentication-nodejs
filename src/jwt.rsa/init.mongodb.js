const mongoose = require("mongoose");

const connnectString = 'mongodb://127.0.0.1:27017/jwt-auth';

mongoose.connect(connnectString)
.then(_ => console.log('mongoDB connected'))
.catch(err => console.log('mongDB error ' + err));

module.exports = mongoose;