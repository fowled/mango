import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	name: { type: String, unique: true },
	price: Number,
	sellerID: String,
});

const MarketItems = model("MarketItems", schema);

export default MarketItems;
