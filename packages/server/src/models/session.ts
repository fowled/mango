import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	id: { type: String, autoIndex: true },
	sid: { type: String, unique: true },
	data: String,
	expiresAt: Date,
});

const Session = model("Session", schema);

export default Session;
