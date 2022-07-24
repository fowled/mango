import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	idOfGuild: String,
	idOfChannel: String,
});

const BirthdaysChannels = model("BirthdaysChannels", schema);

export default BirthdaysChannels;
