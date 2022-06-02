const mongoose = require("mongoose"),
	Schema = mongoose.Schema

module.exports = mongoose.model("Bot", new Schema({
    id: { type: String },
    
    blacklist: {type: Array, default: []}
}));