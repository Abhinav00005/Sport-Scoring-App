const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const Score = require("./models/scoreSchema");

// Connect to MongoDB
const DB =
	"mongodb://abhinav:pass1234@ac-wetuaxb-shard-00-00.hjcegsc.mongodb.net:27017,ac-wetuaxb-shard-00-01.hjcegsc.mongodb.net:27017,ac-wetuaxb-shard-00-02.hjcegsc.mongodb.net:27017/blog-base?ssl=true&replicaSet=atlas-7vl3r0-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("DB connected successfully");
	})
	.catch((err) => {
		console.log(err);
	});

// register view engines
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

// Serving the home page
app.get("/", (req, res) => {
	res.render("index");
});

// Serving the form for adding a score
app.get("/add-score", (req, res) => {
	res.render("add-score");
});

// Handling form submission for adding a score
app.post("/add-score", (req, res) => {
	const score = new Score({
		teamName: req.body.teamName,
		playerName: req.body.playerName,
		runs: parseInt(req.body.runs),
		balls: parseInt(req.body.balls),
		wickets: parseInt(req.body.wickets)
	});

	score
		.save()
		.then(() => res.redirect("/scorecard"))
		.catch((err) => console.log(err));
});

// Fetching the score of particular player from database
app.get("/edit-score/:id", async (req, res) => {
	const score = await Score.findById(req.params.id);
	res.render("edit-score", { score });
});

//  Updating a score on Scorecard
app.post("/update-score/:id", async (req, res) => {
	const score = await Score.findById(req.params.id);
	score.teamName = req.body.teamName;
	score.playerName = req.body.playerName;
	score.runs = req.body.runs;
	score.balls = req.body.balls;
	score.wickets = req.body.wickets;
	await score.save();
	res.redirect("/scorecard");
});

// Serving the scorecard
app.get("/scorecard", (req, res) => {
	Score.find({})
		.then((scores) => {
			res.render("scorecard", { scores });
		})
		.catch((err) => console.log(err));
});

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
