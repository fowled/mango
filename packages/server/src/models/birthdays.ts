import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	id: Number,
	idOfUser: String,
	birthday: String,
	birthdayTimestamp: Number,
	idOfGuild: String,
});

const Birthdays = model("Birthdays", schema);

export default Birthdays;
