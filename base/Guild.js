const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	languages = require("../languages/language-meta.json");

module.exports = mongoose.model("Guild", new Schema({
	id: { type: String },
    
	membersData: { type: Object, default: {} },
	members: [{ type: Schema.Types.ObjectId, ref: "Member" }],

	language: { type: String, default: languages.find((l) => l.default).name },
	plugins: { type: Object, default: {
		premium: false,
		updateslog: false
	}}
}));
