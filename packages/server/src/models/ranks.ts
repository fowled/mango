import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	idOfUser: String,
	xp: Number,
	idOfGuild: Number,
});

const Ranks = model("Ranks", schema);

export default Ranks;
