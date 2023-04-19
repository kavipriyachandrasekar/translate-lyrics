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
	let { tags } = req.query
	tags = tags.split(",")
	const tagObjects = await Tags.find({ tagName: { $in: tags } })
	const songIds = tagObjects.map(tag => tag.songs).flat()
	const songs = await Songs.find({ _id: { $in: songIds } })
	res.send({ songs })
})

router.post("/tags", async (req, res) => {
	const { songName, tags } = req.body
	let song = await Songs.findOne({ songName })
	if (!song) {
		song = await Songs.create({ songName })
	}
	const tagObjects = await Tags.find({ tagName: { $in: tags } })
	const tagsInDatabase = tagObjects.map(tag => tag.tagName)
	const tagsNotInDatabase = tags.filter(tag => !tagsInDatabase.includes(tag))
	const newTags = await Tags.insertMany(tagsNotInDatabase.map(tagName => ({ tagName })))
	const allTags = [...tagObjects, ...newTags]
	allTags.forEach(async tag => {
		if (!tag.songs.includes(song._id)) {
			tag.songs.push(song._id)
			await Tags.updateOne({ _id: tag._id }, { $set: { songs: tag.songs } })
		}
	})

	// add tags to song
	song.tags = allTags.map(tag => tag._id)
	await Songs.updateOne({ _id: song._id }, { $set: { tags: song.tags } })
	res.send({ message: "Song and tags added to database" })
})

// and endpoint to just add unique tags to the database
router.post("/tags/add", async (req, res) => {
	const { tags } = req.body
	const tagObjects = await Tags.find({ tagName: { $in: tags } })
	const tagsInDatabase = tagObjects.map(tag => tag.tagName)
	const tagsNotInDatabase = tags.filter(tag => !tagsInDatabase.includes(tag))
	const newTags = await Tags.insertMany(tagsNotInDatabase.map(tagName => ({ tagName })))
	res.send({ message: "Tags added to database" })
})


module.exports = router