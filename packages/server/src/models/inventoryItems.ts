import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	name: { type: String, unique: true },
	price: Number,
	sellerID: String,
	authorID: String,
	id: { type: Number, autoIndex: true },
});

const InventoryItems = model("InventoryItems", schema);

export default InventoryItems;
