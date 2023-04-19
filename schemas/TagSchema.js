const mongoose = require("mongoose")
const Schema = mongoose.Schema
const TagsSchema = new Schema(
	{
		tagName: { type: String, required: true, trim: true, unique: true },
		songs: [{ type: Schema.Types.ObjectId, ref: "Songs" }],		
	},
	{ timestamps: true }
)

let Tags = mongoose.model("Tags", TagsSchema)
TagsSchema.index({ tagName: "text" })
module.exports = Tags
