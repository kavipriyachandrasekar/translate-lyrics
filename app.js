const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const Database = require("./database.js")
const { cors } = require("./middleware")
const port = process.env.PORT || 3003

new Database().start().then(() => {
	app.listen(port, () => {
		console.log(`Server running on port ${port}`)
	})
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// // API Routes
const songAPI = require("./routes/api/songs.js")
// const meowAPI = require("./routes/api/meow")
// const commentAPI = require("./routes/api/comment")
// const reportAPI = require("./routes/api/report")

app.use("/api/song", cors, songAPI)
// app.use("/api/meow", cors, meowAPI)
// app.use("/api/comment", cors, commentAPI)
// app.use("/api/report", cors, reportAPI)

app.get("/", (_, res) => {
	res.status(200).send({ text: "Hello World!"})
})
