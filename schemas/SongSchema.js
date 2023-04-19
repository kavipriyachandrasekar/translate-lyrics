const mongoose = require("mongoose")
const Schema = mongoose.Schema
const SongsSchema = new Schema(
	{
		songName: { type: String, required: true, trim: true },
		tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
	},
	{ timestamps: true }
)

let Songs = mongoose.model("Songs", SongsSchema)
SongsSchema.index({ songName: "text" })
module.exports = Songs
