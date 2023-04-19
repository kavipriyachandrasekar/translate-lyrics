const express = require("express")
const app = express()
const router = express.Router()
const Songs = require("../../schemas/SongSchema.js")
const Tags = require("../../schemas/TagSchema.js")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "Songs API Online" })
})

router.get("/tags", async (req, res) => {
	const { tags } = req.query
	const tagNames = tags.split(",")
	const tagObjects = await Tags.find({ tagName: { $in: tagNames } })
	const songIds = tagObjects.map(tag => tag.songs).flat()
	const songs = await Songs.find({ _id: { $in: songIds } })
	res.send({ songs })
})

router.post("/tags", async (req, res) => {
	const { songId, tags } = req.body
	const tagNames = tags.split(",")
	const tagObjects = await Tags.find({ tagName: { $in: tagNames } })
	const tagNamesInDb = tagObjects.map(tag => tag.tagName)
	const newTags = tagNames.filter(tag => !tagNamesInDb.includes(tag))
	const newTagObjects = newTags.map(tag => ({ tagName: tag, songs: [songId] }))
	const newTagIds = await Tags.insertMany(newTagObjects)

	const tagIds = [...tagObjects.map(tag => tag._id), ...newTagIds.map(tag => tag._id)]

	res.send({ tagIds })
})

// // a sample fetch request from a client would be
// let tags = ["pop", "rock"]
// let response = await fetch("/api/song/tags?tags=" + tags.join(","))
// let data = await response.json()
// console.log(data)

module.exports = router