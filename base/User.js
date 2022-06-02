const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	id: { type: String },

	registeredAt: { type: Number, default: Date.now() },

	cooldowns: { type: Object, default: {
		rep: 0
	}},

	logged: { type: Boolean, default: false }, // if the user is logged to the dashboard
});

module.exports = mongoose.model("User", userSchema);