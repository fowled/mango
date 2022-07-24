import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	idOfGuild: String,
	idOfChannel: String,
});

const LogChannels = model("LogChannels", schema);

export default LogChannels;
