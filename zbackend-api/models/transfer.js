const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    from: String,
    to: String, 
    tokenId: String
},{timestamps:true});

const Transfer = mongoose.model('Transfer',eventSchema);
module.exports = Transfer;