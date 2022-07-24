import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	idOfUser: { type: String, unique: true },
	money: Number,
});

const MoneyAccs = model("MoneyAccs", schema);

export default MoneyAccs;
