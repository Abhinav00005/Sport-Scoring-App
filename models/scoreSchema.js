const mongoose = require("mongoose");
// Schema defines the structure of the document
//that's gonna store inside a collection

const scoreSchema = new mongoose.Schema({
	teamName: String,
	playerName: String,
	runs: Number,
	balls: Number,
	wickets: Number
});

// model is a thing that surrounds the structure and provides us an interface
// by which we communicate with a database collection for that document type
const Score = mongoose.model("Score", scoreSchema);
module.exports = Score;
