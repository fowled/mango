import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	idOfGuild: String,
	idOfChannel: String,
});

const WelChannels = model("WelChannels", schema);

export default WelChannels;
